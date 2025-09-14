import {
  BaseDirectory,
  readFile,
  stat,
  writeFile,
} from '@tauri-apps/plugin-fs';
import { open } from '@tauri-apps/plugin-dialog';
import { useCallback, useEffect, useState } from 'react';
import { getMimeType } from '@/lib/utils';

export interface FileWithPreview {
  id: string;
  name: string;
  path: string;
  preview: string;
  size: number;
  type: string;
}

export interface FileUploadState {
  files: Array<FileWithPreview>;
  isDragging: boolean;
  errors: Array<string>;
}

export interface FileUploadOptions {
  maxFiles?: number;
  accept?: string;
  onFilesChange?: (files: Array<FileWithPreview>) => void;
}

export interface FileUploadActions {
  handleUpload: () => void;
  handleDrop: (e: React.DragEvent<HTMLElement>) => void;
  handleDragEnter: (e: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
  clearFiles: () => void;
  openFileDialog: () => void;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  handleDelete: (id: string) => void;
}

const JSON_FILE = 'image-links.json';
const JSON_BASE = BaseDirectory.AppData;

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const { maxFiles = Infinity, accept = 'image/*', onFilesChange } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    isDragging: false,
    errors: [],
  });

  const extractMetadata = async (paths: Array<string>): Promise<Array<FileWithPreview>> => {
    const files = await Promise.all(
      paths.map(async (path) => {
        const name = path.split(/[/\\]/).pop()!;
        const fileStat = await stat(path);
        const type = getMimeType(name);

        return {
          id: path,
          name,
          path,
          preview: `file://${path}`,
          size: fileStat.size,
          type,
        };
      })
    );
    return files;
  };

  const saveToJson = useCallback(async (files: Array<FileWithPreview>) => {
    const encoded = new TextEncoder().encode(JSON.stringify(files, null, 2));
    await writeFile(JSON_FILE, encoded, { baseDir: JSON_BASE });
  }, []);

  const loadFromJson = useCallback(async () => {
    try {
      const raw = await readFile(JSON_FILE, { baseDir: JSON_BASE });
      const decoded = new TextDecoder().decode(raw);
      const parsed = JSON.parse(decoded) as Array<FileWithPreview>;

      setState(prev => ({ ...prev, files: parsed, errors: [] }));
      onFilesChange?.(parsed);
    } catch (err) {
      console.warn('Không thể đọc file JSON:', err);
    }
  }, [onFilesChange]);

  const updateFiles = useCallback(async (newPaths: Array<string>) => {
    const metadata = await extractMetadata(newPaths);
    const combined = [...state.files, ...metadata].slice(0, maxFiles);

    setState(prev => ({ ...prev, files: combined, errors: [] }));
    await saveToJson(combined);
    onFilesChange?.(combined);
  }, [state.files, maxFiles, extractMetadata, saveToJson, onFilesChange]);

  const handleUpload = useCallback(async () => {
    const selected = await open({
      multiple: true,
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'] }],
    });

    if (!selected) return;

    const paths = Array.isArray(selected) ? selected : [selected];
    await updateFiles(paths);
  }, [updateFiles]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length === 0) return;

    const paths = Array.from(droppedFiles)
      .map((f) => (f as any).path)
      .filter(Boolean);

    await updateFiles(paths);
  }, [updateFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const clearFiles = useCallback(async () => {
    setState(prev => ({ ...prev, files: [], errors: [] }));
    await saveToJson([]);
    onFilesChange?.([]);
  }, [saveToJson, onFilesChange]);

  const handleDelete = useCallback(async (id: string) => {
    const filtered = state.files.filter(f => f.id !== id);
    setState(prev => ({ ...prev, files: filtered, errors: [] }));
    await saveToJson(filtered);
    onFilesChange?.(filtered);
  }, [state.files, saveToJson, onFilesChange]);

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
    loadFromJson();
  }, []);

  return [
    state,
    {
      handleUpload,
      handleDrop,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      clearFiles,
      openFileDialog,
      getInputProps,
      handleDelete,
    },
  ];
};
