import sizeOf from 'image-size';

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const buffer = await file.arrayBuffer()
  const dimensions = sizeOf(Buffer.from(buffer));
  if (!dimensions.width || !dimensions.height) {
    throw new Error('Không thể lấy kích thước ảnh');
  }
  return { width: dimensions.width, height: dimensions.height };
}