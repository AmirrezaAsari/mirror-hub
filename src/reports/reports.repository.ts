import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface MirrorScanAggregate {
  mirrorId: string;
  mirrorName: string;
  baseUrl: string;
  averageResponseTimeMs: number;
  successRate: number;
  consistencyIndex: number;
  downtimeMinutes: number;
  trend: 'up' | 'down' | 'stable';
  lastCheckedAt: Date | null;
}

export interface MirrorHistoryAggregate {
  mirrorId: string;
  mirrorName: string;
  hour: Date;
  averageResponseTimeMs: number;
  successRate: number;
}

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMirrorAggregates(
    managerType: string,
    since: Date,
  ): Promise<MirrorScanAggregate[]> {
    const mirrors = await this.prisma.mirror.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        mirrorManager: { type: managerType, deletedAt: null },
      },
      select: { id: true, name: true, baseUrl: true },
    });

    if (mirrors.length === 0) {
      return [];
    }

    const mirrorIds = mirrors.map((mirror) => mirror.id);
    const scanResults = await this.prisma.scanResult.findMany({
      where: {
        mirrorId: { in: mirrorIds },
        deletedAt: null,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
    });

    const midpoint = new Date(since.getTime() + (Date.now() - since.getTime()) / 2);

    return mirrors.map((mirror) => {
      const results = scanResults.filter((scan) => scan.mirrorId === mirror.id);
      const firstHalf = results.filter((scan) => scan.createdAt < midpoint);
      const secondHalf = results.filter((scan) => scan.createdAt >= midpoint);

      const averageResponseTimeMs =
        results.length === 0
          ? 0
          : Math.round(
              results.reduce((sum, scan) => sum + scan.responseTimeMs, 0) / results.length,
            );

      const successCount = results.filter((scan) => scan.isAvailable).length;
      const successRate =
        results.length === 0 ? 0 : Math.round((successCount / results.length) * 100);

      const responseTimes = results.map((scan) => scan.responseTimeMs);
      const consistencyIndex = this.calculateConsistency(responseTimes, successRate);

      const failedScans = results.filter((scan) => !scan.isAvailable).length;
      const downtimeMinutes = Math.round(failedScans * 5);

      const firstHalfAvg =
        firstHalf.length === 0
          ? averageResponseTimeMs
          : firstHalf.reduce((sum, scan) => sum + scan.responseTimeMs, 0) / firstHalf.length;
      const secondHalfAvg =
        secondHalf.length === 0
          ? averageResponseTimeMs
          : secondHalf.reduce((sum, scan) => sum + scan.responseTimeMs, 0) / secondHalf.length;

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (secondHalfAvg < firstHalfAvg * 0.9) {
        trend = 'up';
      } else if (secondHalfAvg > firstHalfAvg * 1.1) {
        trend = 'down';
      }

      const lastCheckedAt =
        results.length > 0 ? results[results.length - 1].createdAt : null;

      return {
        mirrorId: mirror.id,
        mirrorName: mirror.name,
        baseUrl: mirror.baseUrl,
        averageResponseTimeMs,
        successRate,
        consistencyIndex,
        downtimeMinutes,
        trend,
        lastCheckedAt,
      };
    });
  }

  async getMirrorHistory(
    managerType: string,
    since: Date,
  ): Promise<MirrorHistoryAggregate[]> {
    const mirrors = await this.prisma.mirror.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        mirrorManager: { type: managerType, deletedAt: null },
      },
      select: { id: true, name: true },
    });

    if (mirrors.length === 0) {
      return [];
    }

    const scanResults = await this.prisma.scanResult.findMany({
      where: {
        mirrorId: { in: mirrors.map((mirror) => mirror.id) },
        deletedAt: null,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
    });

    const hourBuckets = new Map<string, MirrorHistoryAggregate>();

    for (const scan of scanResults) {
      const mirror = mirrors.find((item) => item.id === scan.mirrorId);
      if (!mirror) {
        continue;
      }

      const hourKey = this.truncateToHour(scan.createdAt).toISOString();
      const bucketKey = `${scan.mirrorId}:${hourKey}`;

      const existing = hourBuckets.get(bucketKey);
      if (!existing) {
        hourBuckets.set(bucketKey, {
          mirrorId: scan.mirrorId,
          mirrorName: mirror.name,
          hour: new Date(hourKey),
          averageResponseTimeMs: scan.responseTimeMs,
          successRate: scan.isAvailable ? 100 : 0,
        });
        continue;
      }

      const totalMs = existing.averageResponseTimeMs + scan.responseTimeMs;
      const count = 2;
      existing.averageResponseTimeMs = Math.round(totalMs / count);
      existing.successRate = Math.round((existing.successRate + (scan.isAvailable ? 100 : 0)) / 2);
    }

    return Array.from(hourBuckets.values()).sort(
      (a, b) => a.hour.getTime() - b.hour.getTime(),
    );
  }

  private calculateConsistency(responseTimes: number[], successRate: number): number {
    if (responseTimes.length === 0) {
      return 0;
    }

    const mean = responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length;
    if (mean === 0) {
      return successRate;
    }

    const variance =
      responseTimes.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      responseTimes.length;
    const coefficientOfVariation = Math.sqrt(variance) / mean;
    const consistencyFromVariance = Math.max(0, 100 - Math.round(coefficientOfVariation * 100));

    return Math.round(consistencyFromVariance * 0.6 + successRate * 0.4);
  }

  private truncateToHour(date: Date): Date {
    const truncated = new Date(date);
    truncated.setMinutes(0, 0, 0);
    return truncated;
  }
}
