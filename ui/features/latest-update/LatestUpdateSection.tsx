'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Clock3 } from 'lucide-react';
import { MirrorTable } from '@/components/MirrorTable';
import { PackageSelector } from '@/components/PackageSelector';
import { RefreshButton } from '@/components/RefreshButton';
import { StatusBadge } from '@/components/StatusBadge';
import { useFastestMirrors } from '@/hooks/use-mirrors';
import { useRefreshMirrors } from '@/hooks/use-refresh-mirrors';
import { formatPersianDate } from '@/lib/utils';
import type { PackageType } from '@/types';

interface LatestUpdateSectionProps {
  packageType: PackageType;
  onPackageChange: (value: PackageType) => void;
}

export function LatestUpdateSection({
  packageType,
  onPackageChange,
}: LatestUpdateSectionProps) {
  const { data, isLoading, isError, dataUpdatedAt, isFetching } = useFastestMirrors(packageType);
  const refreshMutation = useRefreshMirrors(packageType);

  const handleRefresh = () => {
    if (refreshMutation.isPending) return;
    refreshMutation.mutate();
  };

  return (
    <section id="latest-update" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold">آخرین به‌روزرسانی</h2>
            <p className="mt-2 text-muted-foreground">
              رتبه‌بندی زنده میرورها بر اساس سرعت و پایداری
            </p>
          </div>
          <PackageSelector value={packageType} onChange={onPackageChange} />
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              label={isFetching ? 'در حال دریافت داده' : 'داده تازه'}
              variant={isFetching ? 'warning' : 'success'}
              pulse={!isFetching}
            />
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              آخرین به‌روزرسانی: {formatPersianDate(data?.updatedAt ?? new Date(dataUpdatedAt))}
            </span>
          </div>
          <RefreshButton
            onClick={handleRefresh}
            isLoading={refreshMutation.isPending}
            disabled={refreshMutation.isPending}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={packageType}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <MirrorTable
              mirrors={data?.mirrors ?? []}
              isLoading={isLoading}
              isError={isError}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
