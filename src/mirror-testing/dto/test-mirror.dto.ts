import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class TestMirrorDto {
  @ApiPropertyOptional({
    description: 'Mirror URL to test. Defaults to mirror baseUrl + configured test file path.',
    example: 'https://pypi.example.com/simple/',
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  mirrorUrl?: string;
}
