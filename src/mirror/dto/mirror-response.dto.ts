import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MirrorResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'US East Mirror' })
  name!: string;

  @ApiProperty({ example: 'https://pypi.example.com/simple' })
  baseUrl!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  mirrorManagerId!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt!: Date | null;
}
