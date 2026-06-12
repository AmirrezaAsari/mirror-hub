import { ApiProperty } from '@nestjs/swagger';

export class FastestMirrorItemDto {
  @ApiProperty()
  rank!: number;

  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  baseUrl!: string;

  @ApiProperty({ description: 'Average response time in ms' })
  downloadSpeedMs!: number;

  @ApiProperty({ description: 'Stability score 0-100' })
  stability!: number;

  @ApiProperty()
  usageCommand!: string;

  @ApiProperty()
  lastCheckedAt!: Date | null;
}

export class FastestMirrorsResponseDto {
  @ApiProperty({ type: [FastestMirrorItemDto] })
  mirrors!: FastestMirrorItemDto[];

  @ApiProperty()
  package!: string;

  @ApiProperty()
  updatedAt!: Date;
}
