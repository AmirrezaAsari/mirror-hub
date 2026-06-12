'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mirrorsService } from '@/services/mirrors.service';
import type { PackageType } from '@/types';

export function useRefreshMirrors(packageType: PackageType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mirrorsService.refresh(packageType),
    onSuccess: (data) => {
      toast.success(`${data.queued} میرور برای به‌روزرسانی در صف قرار گرفت`);
      void queryClient.invalidateQueries({ queryKey: ['mirrors', 'fastest', packageType] });
      void queryClient.invalidateQueries({ queryKey: ['analytics', 'summary', packageType] });
      void queryClient.invalidateQueries({ queryKey: ['analytics', 'history', packageType] });
    },
    onError: () => {
      toast.error('به‌روزرسانی با خطا مواجه شد. لطفاً دوباره تلاش کنید.');
    },
  });
}
