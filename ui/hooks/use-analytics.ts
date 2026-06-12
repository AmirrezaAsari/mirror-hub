'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import type { PackageType } from '@/types';

export function useAnalyticsSummary(packageType: PackageType) {
  return useQuery({
    queryKey: ['analytics', 'summary', packageType],
    queryFn: () => analyticsService.getSummary(packageType),
    staleTime: 60_000,
  });
}

export function useAnalyticsHistory(packageType: PackageType) {
  return useQuery({
    queryKey: ['analytics', 'history', packageType],
    queryFn: () => analyticsService.getHistory(packageType),
    staleTime: 60_000,
  });
}
