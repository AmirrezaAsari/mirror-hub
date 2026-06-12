'use client';

import { Trophy } from 'lucide-react';
import { CopyCommandButton } from '@/components/CopyCommandButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatMs } from '@/lib/utils';
import type { FastestMirror } from '@/types';

interface MirrorTableProps {
  mirrors: FastestMirror[];
  isLoading?: boolean;
  isError?: boolean;
}

function rankStyles(rank: number) {
  if (rank === 1) return 'border-warning/30 bg-warning/5';
  if (rank === 2) return 'border-muted-foreground/20 bg-muted/40';
  if (rank === 3) return 'border-warning/20 bg-warning/5';
  return '';
}

export function MirrorTable({ mirrors, isLoading, isError }: MirrorTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-8 text-center text-sm text-error">
        بارگذاری میرورها با خطا مواجه شد.
      </div>
    );
  }

  if (mirrors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
        هنوز داده‌ای برای این پکیج ثبت نشده است.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr className="text-muted-foreground">
              <th className="px-6 py-4 text-right font-medium">رتبه</th>
              <th className="px-6 py-4 text-right font-medium">نام میرور</th>
              <th className="px-6 py-4 text-right font-medium">سرعت دانلود</th>
              <th className="px-6 py-4 text-right font-medium">پایداری</th>
              <th className="px-6 py-4 text-right font-medium">دستور استفاده</th>
            </tr>
          </thead>
          <tbody>
            {mirrors.map((mirror) => (
              <tr
                key={mirror.id}
                className={cn('border-b border-border/60 last:border-0', rankStyles(mirror.rank))}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-semibold">
                    {mirror.rank <= 3 && <Trophy className="h-4 w-4 text-warning" />}
                    {mirror.rank}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{mirror.name}</td>
                <td className="px-6 py-4">{formatMs(mirror.downloadSpeedMs)}</td>
                <td className="px-6 py-4">
                  <Badge variant={mirror.stability >= 80 ? 'success' : mirror.stability >= 50 ? 'warning' : 'error'}>
                    {mirror.stability}%
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <CopyCommandButton command={mirror.usageCommand} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {mirrors.map((mirror) => (
          <Card key={mirror.id} className={cn(rankStyles(mirror.rank))}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  {mirror.rank <= 3 && <Trophy className="h-4 w-4 text-warning" />}
                  رتبه {mirror.rank}
                </div>
                <Badge variant={mirror.stability >= 80 ? 'success' : 'warning'}>
                  {mirror.stability}% پایداری
                </Badge>
              </div>
              <div>
                <p className="text-base font-semibold">{mirror.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  سرعت: {formatMs(mirror.downloadSpeedMs)}
                </p>
              </div>
              <CopyCommandButton command={mirror.usageCommand} className="w-full justify-between" />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
