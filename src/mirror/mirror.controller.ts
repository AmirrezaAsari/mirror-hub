import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PackageQueryDto } from '../common/dto/package-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../common/dto/paginated-response.dto';
import { ReportsService } from '../reports/reports.service';
import { CreateMirrorDto } from './dto/create-mirror.dto';
import { FastestMirrorsResponseDto } from './dto/fastest-mirror-response.dto';
import { MirrorQueryDto } from './dto/mirror-query.dto';
import { MirrorResponseDto } from './dto/mirror-response.dto';
import { RefreshMirrorsResponseDto } from './dto/refresh-mirrors-response.dto';
import { UpdateMirrorDto } from './dto/update-mirror.dto';
import { MirrorService } from './mirror.service';

class PaginatedMirrorResponseDto {
  data!: MirrorResponseDto[];
  meta!: PaginationMetaDto;
}

@ApiTags('mirrors')
@Controller('mirrors')
export class MirrorController {
  constructor(
    private readonly mirrorService: MirrorService,
    private readonly reportsService: ReportsService,
  ) {}

  @Get('fastest')
  @ApiOperation({ summary: 'Get fastest mirrors ranked by performance' })
  @ApiOkResponse({ type: FastestMirrorsResponseDto })
  getFastest(@Query() query: PackageQueryDto): Promise<FastestMirrorsResponseDto> {
    return this.reportsService.getFastestMirrors(query);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Trigger mirror speed test refresh' })
  @ApiOkResponse({ type: RefreshMirrorsResponseDto })
  refresh(@Body() body: PackageQueryDto): Promise<RefreshMirrorsResponseDto> {
    return this.reportsService.refreshMirrors(body);
  }

  @Post()
  @ApiOperation({ summary: 'Create a mirror' })
  @ApiCreatedResponse({ type: MirrorResponseDto })
  @ApiNotFoundResponse({ description: 'MirrorManager not found' })
  create(@Body() dto: CreateMirrorDto): Promise<MirrorResponseDto> {
    return this.mirrorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List mirrors with pagination and filtering' })
  @ApiOkResponse({ type: PaginatedMirrorResponseDto })
  findAll(@Query() query: MirrorQueryDto): Promise<PaginatedResponseDto<MirrorResponseDto>> {
    return this.mirrorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mirror by id' })
  @ApiOkResponse({ type: MirrorResponseDto })
  @ApiNotFoundResponse({ description: 'Mirror not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MirrorResponseDto> {
    return this.mirrorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mirror' })
  @ApiOkResponse({ type: MirrorResponseDto })
  @ApiNotFoundResponse({ description: 'Mirror or MirrorManager not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMirrorDto,
  ): Promise<MirrorResponseDto> {
    return this.mirrorService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a mirror' })
  @ApiOkResponse({ type: MirrorResponseDto })
  @ApiNotFoundResponse({ description: 'Mirror not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<MirrorResponseDto> {
    return this.mirrorService.remove(id);
  }
}
