'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';

export function HeroSection() {
  const scrollToLatest = () => {
    document.getElementById('latest-update')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl text-center"
      >
        <StatusBadge label="مانیتورینگ زنده میرورها" variant="success" pulse className="mb-6" />

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          سریع‌ترین میرور پکیج
          <span className="block bg-gradient-to-l from-primary via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            برای توسعه‌دهندگان ایرانی
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          میرورها به‌صورت مداوم پایش، تست و رتبه‌بندی می‌شوند تا بتوانید در کمتر از ۵ ثانیه
          بهترین دستور نصب را کپی کنید.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" onClick={scrollToLatest} className="gap-2">
            <Radio className="h-4 w-4" />
            مشاهده آخرین وضعیت
          </Button>
          <Button size="lg" variant="secondary" onClick={scrollToLatest} className="gap-2">
            <ArrowDown className="h-4 w-4" />
            رتبه‌بندی میرورها
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
