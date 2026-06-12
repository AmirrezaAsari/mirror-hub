import { ApiProperty } from '@nestjs/swagger';

export class HistoryDataPointDto {
  @ApiProperty()
  hour!: string;

  @ApiProperty()
  averageResponseTimeMs!: number;

  @ApiProperty()
  successRate!: number;
}

export class MirrorHistoryItemDto {
  @ApiProperty()
  mirrorId!: string;

  @ApiProperty()
  mirrorName!: string;

  @ApiProperty({ type: [HistoryDataPointDto] })
  dataPoints!: HistoryDataPointDto[];
}

export class ReportHistoryResponseDto {
  @ApiProperty()
  package!: string;

  @ApiProperty({ type: [MirrorHistoryItemDto] })
  mirrors!: MirrorHistoryItemDto[];

  @ApiProperty()
  periodHours!: number;

  @ApiProperty()
  generatedAt!: Date;
}
