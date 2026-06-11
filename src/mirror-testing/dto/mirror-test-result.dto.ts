import { ApiProperty } from '@nestjs/swagger';

export class MirrorTestResultDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  mirrorId!: string;

  @ApiProperty({ example: 245, description: 'Total response time in milliseconds' })
  responseTimeMs!: number;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: true })
  isAvailable!: boolean;
}
