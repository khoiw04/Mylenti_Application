import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type {
  FileUploadOptions,
  FileUploadState,
  FileWithPreview,
  HTMLUploadActions,
} from '@/types/func/useFileUpload';
import { fetchMetadata } from '@/func/db.fetchMetadata';

export const useFileUpload = (
  options: FileUploadOptions
): [FileUploadState, HTMLUploadActions] => {
  const { maxFiles = Infinity, accept = 'image/*', onFilesLoad, onFilesChange } = options;

  const [state, setState] = useState<FileUploadState>({
    files: [],
    errors: [],
  });

  const addFromUrl = useCallback(
    async (url: string) => {
      try {
        const { contentType, size } = await fetchMetadata({data: { url }});
        const acceptedMimeTypes = {
          'image/*': 'image/',
          'audio/*': 'audio/',
        };
        // eslint-disable-next-line no-shadow
        const isAudioFile = (url: string) =>  /\.(mp3|wav|ogg|flac)(\?|$)/i.test(url);
        const requiredMimePrefix = acceptedMimeTypes[accept];

        const isValidMime =
          contentType.startsWith(requiredMimePrefix) ||
          contentType === 'application/octet-stream' ||
          (contentType === 'text/html' && isAudioFile(url));

        if (!isValidMime) {
          toast.error(`Xác định loại không hợp lệ: ${contentType}`);
          return;
        }

        const rawName = url.split('/').pop() || 'unknown';
        const name = rawName.split('?')[0];
        const type = contentType;
        const preview = url;

        const file: FileWithPreview = {
          name,
          path: url,
          preview,
          size,
          type,
          binary: new Uint8Array(0),
        };

        const combined = [...state.files, file].slice(0, maxFiles);
        setState((prev) => ({ ...prev, files: combined, errors: [] }));
        onFilesChange?.(combined);
      } catch (err) {
        if (!url || typeof url !== 'string') {
          toast.error('Link không hợp lệ');
          return;
        }
        toast.error(`Không thể thêm link: ${url.slice(0, 100)}...`);
      }
    },
    [state.files, maxFiles, accept]
  );

  const loadFromStore = useCallback(async () => {
    try {
      const stored = await onFilesLoad();
      setState((prev) => ({ ...prev, files: stored, errors: [] }));
    } catch (err) {
      console.warn('Không thể đọc từ store:', err);
    }
  }, []);

  const clearFiles = useCallback(() => {
    setState((prev) => ({ ...prev, files: [], errors: [] }));
    onFilesChange?.([]);
  }, []);

  const handleDelete = useCallback(
    (path: string) => {
      const filtered = state.files.filter((f) => f.path !== path);
      setState((prev) => ({ ...prev, files: filtered, errors: [] }));
      onFilesChange?.(filtered);
    },
    [state.files]
  );

  const getInputProps = useCallback(() => {
    return {
      type: 'text',
      placeholder: 'Dán link vào đây',
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        if (url) addFromUrl(url);
      },
    };
  }, [addFromUrl]);

  useEffect(() => {
    loadFromStore();
  }, []);

  return [
    state,
    {
      clearFiles,
      getInputProps,
      handleDelete,
      addFromUrl,
    },
  ];
};