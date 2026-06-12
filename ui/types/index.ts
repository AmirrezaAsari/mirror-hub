export type PackageType = 'pip' | 'npm' | 'apt';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface FastestMirror {
  rank: number;
  id: string;
  name: string;
  baseUrl: string;
  downloadSpeedMs: number;
  stability: number;
  usageCommand: string;
  lastCheckedAt: string | null;
}

export interface FastestMirrorsResponse {
  mirrors: FastestMirror[];
  package: PackageType;
  updatedAt: string;
}

export interface MirrorAnalytics {
  id: string;
  name: string;
  successRate: number;
  averageResponseTimeMs: number;
  consistencyIndex: number;
  downtimeMinutes: number;
  trend: TrendDirection;
}

export interface ReportSummaryResponse {
  package: PackageType;
  mirrors: MirrorAnalytics[];
  periodHours: number;
  generatedAt: string;
}

export interface HistoryDataPoint {
  hour: string;
  averageResponseTimeMs: number;
  successRate: number;
}

export interface MirrorHistory {
  mirrorId: string;
  mirrorName: string;
  dataPoints: HistoryDataPoint[];
}

export interface ReportHistoryResponse {
  package: PackageType;
  mirrors: MirrorHistory[];
  periodHours: number;
  generatedAt: string;
}

export interface RefreshMirrorsResponse {
  package: PackageType;
  queued: number;
  updatedAt: string;
}

export type ServiceTab = 'latest' | 'analytics';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  linkedin: string;
  initials: string;
}
