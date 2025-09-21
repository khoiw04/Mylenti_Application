import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isTauri } from '@tauri-apps/api/core';
import { fetch as TauriFetch } from '@tauri-apps/plugin-http';
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server';
import { createServerFn } from '@tanstack/react-start';
import type {ClassValue} from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function removeAtPrefix(str: string) {
  return str.replace(/^@/, '');
}

export function addAtPrefix(str: string) {
  return '@' + str;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")                          // Tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, '')           // Xóa các dấu
    .replace(/đ/g, 'd')                        // Xử lý riêng 'đ'
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/'/g, '')                         // Bỏ dấu nháy
    .replace(/\s+/g, '_')                      // Đổi khoảng trắng thành _
    .replace(/[^a-z0-9_]/g, '');               // Chỉ giữ chữ, số và _
}
export function getReadableTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1); // Month: 0-based
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());

  return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

export const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
};


export function timeAgo(
  timestamp: string,
  locale: 'vi' | 'en' = 'vi',
  reverse: boolean = true
) {
  const now = new Date()
  const past = new Date(timestamp)
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

  const formats = {
    vi: {
      seconds: ['giây trước', '%s giây trước'],
      minutes: ['phút trước', '%s phút trước'],
      hours: ['tiếng trước', '%s tiếng trước'],
      days: ['ngày trước', '%s ngày trước'],
    },
    en: {
      seconds: ['seconds ago', '%s seconds ago'],
      minutes: ['minutes ago', '%s minutes ago'],
      hours: ['hours ago', '%s hours ago'],
      days: ['days ago', '%s days ago'],
    },
  }

  const f = formats[locale]
  const absDiff = Math.abs(diff)

  let phrase = ''
  if (absDiff < 60) phrase = reverse ? f.seconds[1].replace('%s', absDiff.toString()) : `${absDiff} ${f.seconds[0]}`
  else if (absDiff < 3600) phrase = reverse ? f.minutes[1].replace('%s', Math.floor(absDiff / 60).toString()) : `${Math.floor(absDiff / 60)} ${f.minutes[0]}`
  else if (absDiff < 86400) phrase = reverse ? f.hours[1].replace('%s', Math.floor(absDiff / 3600).toString()) : `${Math.floor(absDiff / 3600)} ${f.hours[0]}`
  else phrase = reverse ? f.days[1].replace('%s', Math.floor(absDiff / 86400).toString()) : `${Math.floor(absDiff / 86400)} ${f.days[0]}`

  return phrase
}

export function calculateChangePercent(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function truncateMessage(message: string, maxLength: number = 200): string {
  return message.length > maxLength
    ? message.slice(0, maxLength) + "..."
    : message;
}

export const nativeFetch = async (url: string, options: RequestInit) => {
  return !isTauri() ? 
    await fetch(url, options) :
    await TauriFetch(url, options);
};

export const getCachedCookie = createServerFn()
  .validator((d: { key: string }) => d)
  .handler(({ data: { key } }) => {
    const raw = getCookie(key)
    try {
      return raw ? JSON.parse(raw) : undefined
    } catch {
      return undefined
    }
})

export const setCachedCookie = createServerFn()
  .validator((d: { key: string, value: any, maxAge?: number }) => d)
  .handler(({ data: { key, value, maxAge = 600 } }) => {
    setCookie(key, JSON.stringify(value), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge,
    })}
  )

export const clearCachedCookie = createServerFn()
  .validator((d: { key: string }) => d)
  .handler(({ data: { key } }) => {
    deleteCookie(key)
})

export const BinarytoBLOB = (data: { binary: Uint8Array<ArrayBuffer>, type: string }, config: { undefinedType: string, fallbackType: string }) => {
  const blob = new Blob([new Uint8Array(data.binary)], { type: data.type === config.undefinedType ? config.fallbackType : data.type })
  return URL.createObjectURL(blob)
}

export const RandomNumberInRange = (total: number) => {
  return Math.floor(total * Math.random())
}

export const seo = ({
  title,
  description,
  keywords,
  image,
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
}) => {
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: '@khoi' },
    { name: 'twitter:site', content: '@khoi' },
    { name: 'og:type', content: 'website' },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    ...(image
      ? [
          { name: 'twitter:image', content: image },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'og:image', content: image },
        ]
      : []),
  ]

  return tags
}