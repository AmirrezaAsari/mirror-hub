import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPersianDate(date: string | Date | null): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function formatMs(ms: number): string {
  if (ms <= 0) return '—';
  if (ms < 1000) return `${ms} میلی‌ثانیه`;
  return `${(ms / 1000).toFixed(1)} ثانیه`;
}
