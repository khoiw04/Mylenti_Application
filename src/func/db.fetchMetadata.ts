import { createServerFn } from '@tanstack/react-start';

export const fetchMetadata = createServerFn()
  .validator((d: { url: string }) => d)
  .handler(async ({ data: { url } }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Không thể tải file: ${response.status}`);
      }

      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
      const buffer = await response.arrayBuffer();

      return {
        contentType,
        size: buffer.byteLength
      };
    } catch (err) {
      throw new Error(`Lỗi khi tải file: ${(err as Error).message}`);
    }
  })