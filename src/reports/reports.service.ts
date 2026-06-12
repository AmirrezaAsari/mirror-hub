import { Injectable } from '@nestjs/common';
import {
  buildUsageCommand,
  PACKAGE_TO_MANAGER_TYPE,
  PackageType,
} from '../common/constants/package-type';
import { PackageQueryDto } from '../common/dto/package-query.dto';
import {
  FastestMirrorItemDto,
  FastestMirrorsResponseDto,
} from '../mirror/dto/fastest-mirror-response.dto';
import { RefreshMirrorsResponseDto } from '../mirror/dto/refresh-mirrors-response.dto';
import { MirrorRefreshService } from './mirror-refresh.service';
import { ReportsRepository } from './reports.repository';
import { ReportHistoryResponseDto } from './dto/report-history.dto';
import { ReportSummaryResponseDto } from './dto/mirror-analytics.dto';

const REPORT_PERIOD_HOURS = 24;

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportsRepository: ReportsRepository,
    private readonly mirrorRefreshService: MirrorRefreshService,
  ) {}

  async getFastestMirrors(query: PackageQueryDto): Promise<FastestMirrorsResponseDto> {
    const since = this.getPeriodStart();
    const managerType = PACKAGE_TO_MANAGER_TYPE[query.package];
    const aggregates = await this.reportsRepository.getMirrorAggregates(managerType, since);
    console.log(aggregates);
    const mirrors: FastestMirrorItemDto[] = aggregates
      .sort((a, b) => {
        if (b.successRate !== a.successRate) {
          return b.successRate - a.successRate;
        }
        return a.averageResponseTimeMs - b.averageResponseTimeMs;
      })
      .map((item, index) => ({
        rank: index + 1,
        id: item.mirrorId,
        name: item.mirrorName,
        baseUrl: item.baseUrl,
        downloadSpeedMs: item.averageResponseTimeMs,
        stability: item.consistencyIndex,
        usageCommand: buildUsageCommand(query.package, item.baseUrl),
        lastCheckedAt: item.lastCheckedAt,
      }));
      console.log(mirrors);
    return {
      mirrors,
      package: query.package,
      updatedAt: new Date(),
    };
  }

  async getSummary(query: PackageQueryDto): Promise<ReportSummaryResponseDto> {
    const since = this.getPeriodStart();
    const managerType = PACKAGE_TO_MANAGER_TYPE[query.package];
    const aggregates = await this.reportsRepository.getMirrorAggregates(managerType, since);

    return {
      package: query.package,
      periodHours: REPORT_PERIOD_HOURS,
      generatedAt: new Date(),
      mirrors: aggregates.map((item) => ({
        id: item.mirrorId,
        name: item.mirrorName,
        successRate: item.successRate,
        averageResponseTimeMs: item.averageResponseTimeMs,
        consistencyIndex: item.consistencyIndex,
        downtimeMinutes: item.downtimeMinutes,
        trend: item.trend,
      })),
    };
  }

  async getHistory(query: PackageQueryDto): Promise<ReportHistoryResponseDto> {
    const since = this.getPeriodStart();
    const managerType = PACKAGE_TO_MANAGER_TYPE[query.package];
    const history = await this.reportsRepository.getMirrorHistory(managerType, since);

    const grouped = new Map<string, ReportHistoryResponseDto['mirrors'][number]>();

    for (const point of history) {
      const existing = grouped.get(point.mirrorId);
      const dataPoint = {
        hour: point.hour.toISOString(),
        averageResponseTimeMs: point.averageResponseTimeMs,
        successRate: point.successRate,
      };

      if (!existing) {
        grouped.set(point.mirrorId, {
          mirrorId: point.mirrorId,
          mirrorName: point.mirrorName,
          dataPoints: [dataPoint],
        });
        continue;
      }

      existing.dataPoints.push(dataPoint);
    }

    return {
      package: query.package,
      periodHours: REPORT_PERIOD_HOURS,
      generatedAt: new Date(),
      mirrors: Array.from(grouped.values()),
    };
  }

  async refreshMirrors(query: PackageQueryDto): Promise<RefreshMirrorsResponseDto> {
    const queued = await this.mirrorRefreshService.queuePackageRefresh(query.package);

    return {
      package: query.package,
      queued,
      updatedAt: new Date(),
    };
  }

  private getPeriodStart(): Date {
    return new Date(Date.now() - REPORT_PERIOD_HOURS * 60 * 60 * 1000);
  }
}
