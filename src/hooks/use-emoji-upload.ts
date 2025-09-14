import { readFile, stat } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useCallback, useEffect, useState } from 'react';

import type { FileUploadActions, FileUploadOptions, FileUploadState, FileWithPreview } from '@/types/func/useFileUpload';
import { getMimeType } from '@/lib/utils';
import { OBSOverlaySettingsProps, clearEmojis, loadEmojis, saveEmojis } from '@/store';
import { fallbackEmoji } from '@/data/obs-overlay';

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const { maxFiles = Infinity, accept = 'image/*' } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    errors: [],
  })

  // Back-end
  const extractMetadata = async (paths: Array<string>): Promise<Array<FileWithPreview>> => {
    const files = await Promise.all(
      paths.map(async (path) => {
        const name = path.split(/[/\\]/).pop()!;
        const fileStat = await stat(path);
        const type = getMimeType(name);
        const binary = await readFile(path);

        return {
          name,
          path,
          preview: convertFileSrc(path),
          size: fileStat.size,
          type,
          binary,
        };
      })
    );
    return files;
  };

  const loadFromStore = useCallback(async () => {
    try {
      const stored = await loadEmojis();
      setState(prev => ({ ...prev, files: stored, errors: [] }));
    } catch (err) {
      console.warn('Không thể đọc từ store:', err);
    }
  }, []);

  const updateFiles = useCallback(async (newPaths: Array<string>) => {
    const metadata = await extractMetadata(newPaths);
    const combined = [...state.files, ...metadata].slice(0, maxFiles);

    setState(prev => ({ ...prev, files: combined, errors: [] }));
    OBSOverlaySettingsProps.setState((prev) => ({
      ...prev,
      DonateProps: {
        ...prev.DonateProps,
        emojiURL: metadata,
      },
    }))

    await saveEmojis(combined);
  }, [state.files, maxFiles, extractMetadata]);

  const handleUpload = useCallback(async () => {
    const selected = await open({
      multiple: true,
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'] }],
    });

    if (!selected) return;

    const paths = Array.isArray(selected) ? selected : [selected];
    await updateFiles(paths);
  }, [updateFiles]);


  // Front-end
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    const paths = Array.from(droppedFiles)
      .map((f) => (f as any).path)
      .filter(Boolean);

    await updateFiles(paths);
  }, [updateFiles]);

  const clearFiles = useCallback(async () => {
    await clearEmojis();
    setState(prev => ({ ...prev, files: [], errors: [] }));
    OBSOverlaySettingsProps.setState((prev) => ({
      ...prev,
      DonateProps: {
        ...prev.DonateProps,
        emojiURL: fallbackEmoji,
      },
    }))
  }, []);

  const handleDelete = useCallback(async (path: string) => {
    const filtered = state.files.filter(f => f.path !== path);
    setState(prev => ({ ...prev, files: filtered, errors: [] }));

    OBSOverlaySettingsProps.setState((prev) => ({
      ...prev,
      DonateProps: {
        ...prev.DonateProps,
        emojiURL: filtered.length > 0 ? filtered : fallbackEmoji,
      },
    }));

    await saveEmojis(filtered);
  }, [state.files]);

  const openFileDialog = useCallback(() => {
    handleUpload();
  }, [handleUpload]);

  const getInputProps = useCallback(() => {
    return {
      type: 'file',
      accept,
      multiple: true,
      style: { display: 'none' },
      onClick: openFileDialog,
    };
  }, [accept, openFileDialog]);

  useEffect(() => {
    loadFromStore();
  }, []);

  return [
    state,
    {
      handleUpload,
      handleDrop,
      clearFiles,
      openFileDialog,
      getInputProps,
      handleDelete,
    },
  ];
};
