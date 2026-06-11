import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MirrorManager } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CreateMirrorManagerDto } from './dto/create-mirror-manager.dto';
import { MirrorManagerQueryDto } from './dto/mirror-manager-query.dto';
import { MirrorManagerResponseDto } from './dto/mirror-manager-response.dto';
import { UpdateMirrorManagerDto } from './dto/update-mirror-manager.dto';
import { MirrorManagerRepository } from './mirror-manager.repository';

@Injectable()
export class MirrorManagerService {
  constructor(private readonly mirrorManagerRepository: MirrorManagerRepository) {}

  async create(dto: CreateMirrorManagerDto): Promise<MirrorManagerResponseDto> {
    const mirrorManager = await this.mirrorManagerRepository.create({
      name: dto.name,
      type: dto.type,
    });
    return this.toResponse(mirrorManager);
  }

  async findAll(
    query: MirrorManagerQueryDto,
  ): Promise<PaginatedResponseDto<MirrorManagerResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const filterParams = {
      name: query.name,
      type: query.type,
      includeDeleted: query.includeDeleted,
    };

    const [items, total] = await Promise.all([
      this.mirrorManagerRepository.findMany({ ...filterParams, skip, take: limit }),
      this.mirrorManagerRepository.count(filterParams),
    ]);

    return buildPaginatedResponse(
      items.map((item) => this.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<MirrorManagerResponseDto> {
    const mirrorManager = await this.getActiveOrThrow(id);
    return this.toResponse(mirrorManager);
  }

  async update(id: string, dto: UpdateMirrorManagerDto): Promise<MirrorManagerResponseDto> {
    await this.getActiveOrThrow(id);

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    const mirrorManager = await this.mirrorManagerRepository.update(id, dto);
    return this.toResponse(mirrorManager);
  }

  async remove(id: string): Promise<MirrorManagerResponseDto> {
    await this.getActiveOrThrow(id);
    const mirrorManager = await this.mirrorManagerRepository.softDelete(id);
    return this.toResponse(mirrorManager);
  }

  private async getActiveOrThrow(id: string): Promise<MirrorManager> {
    const mirrorManager = await this.mirrorManagerRepository.findById(id);
    if (!mirrorManager) {
      throw new NotFoundException(`MirrorManager with id "${id}" not found`);
    }
    return mirrorManager;
  }

  private toResponse(mirrorManager: MirrorManager): MirrorManagerResponseDto {
    return {
      id: mirrorManager.id,
      name: mirrorManager.name,
      type: mirrorManager.type,
      createdAt: mirrorManager.createdAt,
      updatedAt: mirrorManager.updatedAt,
      deletedAt: mirrorManager.deletedAt,
    };
  }
}
