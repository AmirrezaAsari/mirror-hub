import { ApiProperty } from '@nestjs/swagger';

export class MirrorAnalyticsItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ description: 'Success rate 0-100' })
  successRate!: number;

  @ApiProperty()
  averageResponseTimeMs!: number;

  @ApiProperty({ description: 'Consistency index 0-100' })
  consistencyIndex!: number;

  @ApiProperty({ description: 'Downtime in minutes over 24h' })
  downtimeMinutes!: number;

  @ApiProperty({ description: 'Trend: up, down, or stable' })
  trend!: 'up' | 'down' | 'stable';
}

export class ReportSummaryResponseDto {
  @ApiProperty()
  package!: string;

  @ApiProperty({ type: [MirrorAnalyticsItemDto] })
  mirrors!: MirrorAnalyticsItemDto[];

  @ApiProperty()
  periodHours!: number;

  @ApiProperty()
  generatedAt!: Date;
}
