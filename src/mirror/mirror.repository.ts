import { Injectable } from '@nestjs/common';
import { Mirror, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface MirrorFindManyParams {
  skip: number;
  take: number;
  name?: string;
  isActive?: boolean;
  mirrorManagerId?: string;
  includeDeleted?: boolean;
}

@Injectable()
export class MirrorRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.MirrorCreateInput): Promise<Mirror> {
    return this.prisma.mirror.create({ data });
  }

  findMany(params: MirrorFindManyParams): Promise<Mirror[]> {
    return this.prisma.mirror.findMany({
      where: this.buildWhereClause(params),
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(params: Omit<MirrorFindManyParams, 'skip' | 'take'>): Promise<number> {
    return this.prisma.mirror.count({
      where: this.buildWhereClause(params),
    });
  }

  findById(id: string, includeDeleted = false): Promise<Mirror | null> {
    return this.prisma.mirror.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  update(id: string, data: Prisma.MirrorUpdateInput): Promise<Mirror> {
    return this.prisma.mirror.update({ where: { id }, data });
  }

  softDelete(id: string): Promise<Mirror> {
    return this.prisma.mirror.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findAllActive(): Promise<Mirror[]> {
    return this.prisma.mirror.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  findAllActiveByManagerType(managerType: string): Promise<Mirror[]> {
    return this.prisma.mirror.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        mirrorManager: {
          type: managerType,
          deletedAt: null,
        },
      },
      include: {
        mirrorManager: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  private buildWhereClause(
    params: Omit<MirrorFindManyParams, 'skip' | 'take'>,
  ): Prisma.MirrorWhereInput {
    const where: Prisma.MirrorWhereInput = {};

    if (!params.includeDeleted) {
      where.deletedAt = null;
    }

    if (params.name) {
      where.name = { contains: params.name, mode: 'insensitive' };
    }

    if (params.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    if (params.mirrorManagerId) {
      where.mirrorManagerId = params.mirrorManagerId;
    }

    return where;
  }
}
