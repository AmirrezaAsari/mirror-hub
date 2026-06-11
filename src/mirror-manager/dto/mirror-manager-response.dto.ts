import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MirrorManagerResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'PyPI Mirror Hub' })
  name!: string;

  @ApiProperty({ example: 'pypi' })
  type!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt!: Date | null;
}
