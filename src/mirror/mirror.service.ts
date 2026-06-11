import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Mirror } from '@prisma/client';
import { buildPaginatedResponse, PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { MirrorManagerRepository } from '../mirror-manager/mirror-manager.repository';
import { CreateMirrorDto } from './dto/create-mirror.dto';
import { MirrorQueryDto } from './dto/mirror-query.dto';
import { MirrorResponseDto } from './dto/mirror-response.dto';
import { UpdateMirrorDto } from './dto/update-mirror.dto';
import { MirrorRepository } from './mirror.repository';

@Injectable()
export class MirrorService {
  constructor(
    private readonly mirrorRepository: MirrorRepository,
    private readonly mirrorManagerRepository: MirrorManagerRepository,
  ) {}

  async create(dto: CreateMirrorDto): Promise<MirrorResponseDto> {
    await this.ensureMirrorManagerExists(dto.mirrorManagerId);

    const mirror = await this.mirrorRepository.create({
      name: dto.name,
      baseUrl: dto.baseUrl,
      isActive: dto.isActive ?? true,
      mirrorManager: { connect: { id: dto.mirrorManagerId } },
    });

    return this.toResponse(mirror);
  }

  async findAll(query: MirrorQueryDto): Promise<PaginatedResponseDto<MirrorResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const filterParams = {
      name: query.name,
      isActive: query.isActive,
      mirrorManagerId: query.mirrorManagerId,
      includeDeleted: query.includeDeleted,
    };

    const [items, total] = await Promise.all([
      this.mirrorRepository.findMany({ ...filterParams, skip, take: limit }),
      this.mirrorRepository.count(filterParams),
    ]);

    return buildPaginatedResponse(
      items.map((item) => this.toResponse(item)),
      total,
      page,
      limit,
    );
  }

  async findOne(id: string): Promise<MirrorResponseDto> {
    const mirror = await this.getActiveOrThrow(id);
    return this.toResponse(mirror);
  }

  async update(id: string, dto: UpdateMirrorDto): Promise<MirrorResponseDto> {
    await this.getActiveOrThrow(id);

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    if (dto.mirrorManagerId) {
      await this.ensureMirrorManagerExists(dto.mirrorManagerId);
    }

    const mirror = await this.mirrorRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.baseUrl !== undefined && { baseUrl: dto.baseUrl }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.mirrorManagerId !== undefined && {
        mirrorManager: { connect: { id: dto.mirrorManagerId } },
      }),
    });

    return this.toResponse(mirror);
  }

  async remove(id: string): Promise<MirrorResponseDto> {
    await this.getActiveOrThrow(id);
    const mirror = await this.mirrorRepository.softDelete(id);
    return this.toResponse(mirror);
  }

  private async getActiveOrThrow(id: string): Promise<Mirror> {
    const mirror = await this.mirrorRepository.findById(id);
    if (!mirror) {
      throw new NotFoundException(`Mirror with id "${id}" not found`);
    }
    return mirror;
  }

  private async ensureMirrorManagerExists(mirrorManagerId: string): Promise<void> {
    const mirrorManager = await this.mirrorManagerRepository.findById(mirrorManagerId);
    if (!mirrorManager) {
      throw new NotFoundException(`MirrorManager with id "${mirrorManagerId}" not found`);
    }
  }

  private toResponse(mirror: Mirror): MirrorResponseDto {
    return {
      id: mirror.id,
      name: mirror.name,
      baseUrl: mirror.baseUrl,
      isActive: mirror.isActive,
      mirrorManagerId: mirror.mirrorManagerId,
      createdAt: mirror.createdAt,
      updatedAt: mirror.updatedAt,
      deletedAt: mirror.deletedAt,
    };
  }
}
