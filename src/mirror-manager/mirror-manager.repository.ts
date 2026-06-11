import { Injectable } from '@nestjs/common';
import { MirrorManager, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface MirrorManagerFindManyParams {
  skip: number;
  take: number;
  name?: string;
  type?: string;
  includeDeleted?: boolean;
}

@Injectable()
export class MirrorManagerRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.MirrorManagerCreateInput): Promise<MirrorManager> {
    return this.prisma.mirrorManager.create({ data });
  }

  findMany(params: MirrorManagerFindManyParams): Promise<MirrorManager[]> {
    return this.prisma.mirrorManager.findMany({
      where: this.buildWhereClause(params),
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(params: Omit<MirrorManagerFindManyParams, 'skip' | 'take'>): Promise<number> {
    return this.prisma.mirrorManager.count({
      where: this.buildWhereClause(params),
    });
  }

  findById(id: string, includeDeleted = false): Promise<MirrorManager | null> {
    return this.prisma.mirrorManager.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  update(id: string, data: Prisma.MirrorManagerUpdateInput): Promise<MirrorManager> {
    return this.prisma.mirrorManager.update({ where: { id }, data });
  }

  softDelete(id: string): Promise<MirrorManager> {
    return this.prisma.mirrorManager.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private buildWhereClause(
    params: Omit<MirrorManagerFindManyParams, 'skip' | 'take'>,
  ): Prisma.MirrorManagerWhereInput {
    const where: Prisma.MirrorManagerWhereInput = {};

    if (!params.includeDeleted) {
      where.deletedAt = null;
    }

    if (params.name) {
      where.name = { contains: params.name, mode: 'insensitive' };
    }

    if (params.type) {
      where.type = params.type;
    }

    return where;
  }
}
