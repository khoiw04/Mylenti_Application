import imageCompression from 'browser-image-compression';
import { getReadableTimestamp, slugify } from "@/lib/utils";
import { avatarCompression } from '@/data/settings';

export type MainBlobs = {
  images: string | Array<string | null>;
  user_name: string;
  title: string;
  isAvatar: boolean;
};

type UploadResult = {
  message?: string;
  files: Array<File>;
};

const mimeToExt: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

function normalizeImages(images: MainBlobs['images']): Array<string> {
  if (typeof images === 'string') {
    return images.trim() ? [images] : [];
  }

  return images.filter((url): url is string => typeof url === 'string' && url.trim() !== '');
}

function generateFileName(user_name: string, title: string, index: number, _ext: string, isAvatar: boolean): string {
  const prefix = `${slugify(user_name)}_${slugify(title)}`;
  const timestamp = getReadableTimestamp();

  return isAvatar
    ? `${user_name}_avatar`
    : `${prefix}_${timestamp}_${index}_${Math.floor(Math.random() * 10000)}`;
}

async function processImage(url: string, index: number, config: MainBlobs): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();

  const ext = mimeToExt[blob.type] || 'png';
  const fileName = generateFileName(config.user_name, config.title, index, ext, config.isAvatar);

  const originalFile = new File([blob], fileName, { type: blob.type });
  const compressed = await imageCompression(originalFile, avatarCompression);

  return new File([compressed], fileName, { type: compressed.type });
}

export async function LinksToFiles(config: MainBlobs): Promise<UploadResult> {
  const validUrls = normalizeImages(config.images);

  if (validUrls.length === 0) {
    return {
      message: "Không có ảnh nào để upload.",
      files: []
    };
  }

  const files = await Promise.all(
    validUrls.map((url, index) => processImage(url, index, config))
  );

  return { files };
}
