import { apiClient } from '@/lib/api-client';
import type { PackageType, ReportHistoryResponse, ReportSummaryResponse } from '@/types';

export const analyticsService = {
  getSummary(packageType: PackageType) {
    return apiClient
      .get<ReportSummaryResponse>('/reports/summary', { params: { package: packageType } })
      .then((res) => res.data);
  },

  getHistory(packageType: PackageType) {
    return apiClient
      .get<ReportHistoryResponse>('/reports/history', { params: { package: packageType } })
      .then((res) => res.data);
  },
};
