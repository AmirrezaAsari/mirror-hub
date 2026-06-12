import { apiClient } from '@/lib/api-client';
import type { FastestMirrorsResponse, PackageType, RefreshMirrorsResponse } from '@/types';

export const mirrorsService = {
  getFastest(packageType: PackageType) {
    return apiClient
      .get<FastestMirrorsResponse>('/mirrors/fastest', { params: { package: packageType } })
      .then((res) => res.data);
  },

  refresh(packageType: PackageType) {
    return apiClient
      .post<RefreshMirrorsResponse>('/mirrors/refresh', { package: packageType })
      .then((res) => res.data);
  },
};
