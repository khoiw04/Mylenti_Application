import {  clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
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

export function timeAgo(timestamp: string, locale: 'vi' | 'en' = 'vi') {
  const now = new Date()
  const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  const past = new Date(timestamp)
  const diff = Math.floor((nowUTC.getTime() - past.getTime()) / 1000)

  const formats = {
    vi: {
      seconds: 'giây trước',
      minutes: 'phút trước',
      hours: 'tiếng trước',
      days: 'ngày trước',
    },
    en: {
      seconds: 'seconds ago',
      minutes: 'minutes ago',
      hours: 'hours ago',
      days: 'days ago',
    },
  }

  const f = formats[locale]

  if (diff < 60) return `${diff} ${f.seconds}`
  if (diff < 3600) return `${Math.floor(diff / 60)} ${f.minutes}`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${f.hours}`
  return `${Math.floor(diff / 86400)} ${f.days}`
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