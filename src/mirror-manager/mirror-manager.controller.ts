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
import { PaginatedResponseDto, PaginationMetaDto } from '../common/dto/paginated-response.dto';
import { CreateMirrorManagerDto } from './dto/create-mirror-manager.dto';
import { MirrorManagerQueryDto } from './dto/mirror-manager-query.dto';
import { MirrorManagerResponseDto } from './dto/mirror-manager-response.dto';
import { UpdateMirrorManagerDto } from './dto/update-mirror-manager.dto';
import { MirrorManagerService } from './mirror-manager.service';

class PaginatedMirrorManagerResponseDto {
  data!: MirrorManagerResponseDto[];
  meta!: PaginationMetaDto;
}

@ApiTags('mirror-managers')
@Controller('mirror-managers')
export class MirrorManagerController {
  constructor(private readonly mirrorManagerService: MirrorManagerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a mirror manager' })
  @ApiCreatedResponse({ type: MirrorManagerResponseDto })
  create(@Body() dto: CreateMirrorManagerDto): Promise<MirrorManagerResponseDto> {
    return this.mirrorManagerService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List mirror managers with pagination and filtering' })
  @ApiOkResponse({ type: PaginatedMirrorManagerResponseDto })
  findAll(
    @Query() query: MirrorManagerQueryDto,
  ): Promise<PaginatedResponseDto<MirrorManagerResponseDto>> {
    return this.mirrorManagerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mirror manager by id' })
  @ApiOkResponse({ type: MirrorManagerResponseDto })
  @ApiNotFoundResponse({ description: 'MirrorManager not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MirrorManagerResponseDto> {
    return this.mirrorManagerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mirror manager' })
  @ApiOkResponse({ type: MirrorManagerResponseDto })
  @ApiNotFoundResponse({ description: 'MirrorManager not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMirrorManagerDto,
  ): Promise<MirrorManagerResponseDto> {
    return this.mirrorManagerService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete a mirror manager' })
  @ApiOkResponse({ type: MirrorManagerResponseDto })
  @ApiNotFoundResponse({ description: 'MirrorManager not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<MirrorManagerResponseDto> {
    return this.mirrorManagerService.remove(id);
  }
}
