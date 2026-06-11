import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMirrorManagerDto {
  @ApiProperty({ example: 'PyPI Mirror Hub', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'pypi', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type!: string;
}
