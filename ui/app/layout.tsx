import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mirror Hub | میرور هاب',
  description: 'پلتفرم پایش و رتبه‌بندی سریع‌ترین میرورهای پکیج برای توسعه‌دهندگان ایرانی',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} min-h-screen bg-background font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
