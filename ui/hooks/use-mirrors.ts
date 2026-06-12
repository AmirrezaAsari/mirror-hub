'use client';

import { useQuery } from '@tanstack/react-query';
import { mirrorsService } from '@/services/mirrors.service';
import type { PackageType } from '@/types';

export function useFastestMirrors(packageType: PackageType) {
  return useQuery({
    queryKey: ['mirrors', 'fastest', packageType],
    queryFn: () => mirrorsService.getFastest(packageType),
    staleTime: 60_000,
  });
}
