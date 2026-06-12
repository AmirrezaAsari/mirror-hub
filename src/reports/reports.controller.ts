import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PackageQueryDto } from '../common/dto/package-query.dto';
import { ReportHistoryResponseDto } from './dto/report-history.dto';
import { ReportSummaryResponseDto } from './dto/mirror-analytics.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get 24-hour mirror analytics summary' })
  @ApiOkResponse({ type: ReportSummaryResponseDto })
  getSummary(@Query() query: PackageQueryDto): Promise<ReportSummaryResponseDto> {
    return this.reportsService.getSummary(query);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get 24-hour mirror analytics history' })
  @ApiOkResponse({ type: ReportHistoryResponseDto })
  getHistory(@Query() query: PackageQueryDto): Promise<ReportHistoryResponseDto> {
    return this.reportsService.getHistory(query);
  }
}
