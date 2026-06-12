'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { PackageSelector } from '@/components/PackageSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalyticsHistory, useAnalyticsSummary } from '@/hooks/use-analytics';
import type { PackageType } from '@/types';

interface AnalyticsSectionProps {
  packageType: PackageType;
  onPackageChange: (value: PackageType) => void;
}

export function AnalyticsSection({ packageType, onPackageChange }: AnalyticsSectionProps) {
  const summaryQuery = useAnalyticsSummary(packageType);
  const historyQuery = useAnalyticsHistory(packageType);

  const isLoading = summaryQuery.isLoading || historyQuery.isLoading;
  const isError = summaryQuery.isError || historyQuery.isError;

  const historyByMirror = new Map(
    (historyQuery.data?.mirrors ?? []).map((item) => [item.mirrorId, item.dataPoints]),
  );

  return (
    <section id="analytics" className="scroll-mt-28 bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold">تحلیل ۲۴ ساعته</h2>
            <p className="mt-2 text-muted-foreground">
              پایداری، سرعت و روند عملکرد میرورها در ۲۴ ساعت گذشته
            </p>
          </div>
          <PackageSelector value={packageType} onChange={onPackageChange} />
        </div>

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-error/20 bg-error/5 p-8 text-center text-error">
            بارگذاری گزارش تحلیلی با خطا مواجه شد.
          </div>
        )}

        {!isLoading && !isError && summaryQuery.data?.mirrors.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            داده تحلیلی برای این پکیج موجود نیست.
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={packageType}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {(summaryQuery.data?.mirrors ?? []).map((mirror) => (
              <AnalyticsCard
                key={mirror.id}
                mirror={mirror}
                history={historyByMirror.get(mirror.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
