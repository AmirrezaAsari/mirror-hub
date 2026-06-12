import { ApiProperty } from '@nestjs/swagger';

export class RefreshMirrorsResponseDto {
  @ApiProperty()
  package!: string;

  @ApiProperty()
  queued!: number;

  @ApiProperty()
  updatedAt!: Date;
}
