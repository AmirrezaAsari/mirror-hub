import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PackageType } from '../constants/package-type';

export class PackageQueryDto {
  @ApiProperty({ enum: PackageType, example: PackageType.Pip })
  @IsEnum(PackageType)
  package!: PackageType;
}
