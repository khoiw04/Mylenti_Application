import { readFile, stat } from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { useCallback, useEffect, useState } from 'react';

import type { FileUploadActions, FileUploadOptions, FileUploadState } from '@/types/func/useFileUpload';
import { getMimeType } from '@/lib/utils';

export const useFileUpload = (
  options: FileUploadOptions
): [FileUploadState, FileUploadActions] => {
  const { maxFiles = Infinity, accept = 'image/*', onFilesLoad, onFilesChange } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    errors: [],
  })

  // Back-end
  const uploadFiles = useCallback(async (paths: Array<string>) => {
    try {
      const metadata = await Promise.all(
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
      const combined = [...state.files, ...metadata].slice(0, maxFiles);
      setState(prev => ({ ...prev, files: combined, errors: [] }));
      onFilesChange?.(combined)
    } catch (err) {
        setState((prev) => ({
          ...prev,
          errors: [`Không thể thêm link: ${paths}`],
        }));
      }
    },
    [state.files, maxFiles])

  const loadFromStore = useCallback(async () => {
    try {
      const stored = await onFilesLoad()
      setState(prev => ({ ...prev, files: stored, errors: [] }));
    } catch (err) {
      console.warn('Không thể đọc từ store:', err);
    }
  }, []);

  const handleUpload = useCallback(async () => {
      // eslint-disable-next-line no-shadow
      const getFilters = (accept: string) => {
        if (accept === 'audio/*') {
          return [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }];
        }
        if (accept === 'image/*') {
          return [{ name: 'Image Files', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'] }];
        }
        return [];
      };

      const selected = await open({
        multiple: true,
        filters: getFilters(accept)
      });
    
      if (!selected) return
    
      const paths = Array.isArray(selected) ? selected : [selected]
      await uploadFiles(paths)
      return []
  }, [uploadFiles]);


  // Front-end
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    const paths = Array.from(droppedFiles)
      .map((f) => (f as any).path)
      .filter(Boolean);

    await uploadFiles(paths);
  }, [uploadFiles]);

  const clearFiles = useCallback(() => {
    setState(prev => ({ ...prev, files: [], errors: [] }));

    onFilesChange?.([])
  }, []);

  const handleDelete = useCallback((path: string) => {
    const filtered = state.files.filter(f => f.path !== path);
    setState(prev => ({ ...prev, files: filtered, errors: [] }));
    
    onFilesChange?.(filtered)
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