import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MirrorTestResultDto } from './dto/mirror-test-result.dto';
import { TestMirrorDto } from './dto/test-mirror.dto';
import { MirrorTestingService } from './mirror-testing.service';

@ApiTags('mirrors')
@Controller()
export class MirrorTestingController {
  constructor(private readonly mirrorTestingService: MirrorTestingService) {}

  @Post('mirrors/:id/test')
  @ApiOperation({ summary: 'Test mirror availability and store scan result' })
  @ApiOkResponse({ type: MirrorTestResultDto })
  @ApiNotFoundResponse({ description: 'Mirror not found' })
  testMirror(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TestMirrorDto,
  ): Promise<MirrorTestResultDto> {
    if (dto.mirrorUrl) {
      return this.mirrorTestingService.testMirrorUrl(id, dto.mirrorUrl);
    }

    return this.mirrorTestingService.testMirror(id);
  }
}
