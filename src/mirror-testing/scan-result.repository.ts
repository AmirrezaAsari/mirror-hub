import { Injectable } from '@nestjs/common';
import { ScanResult } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface CreateScanResultData {
  mirrorId: string;
  responseTimeMs: number;
  statusCode: number;
  isAvailable: boolean;
  packageSizeBytes: number;
}

@Injectable()
export class ScanResultRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateScanResultData): Promise<ScanResult> {
    return this.prisma.scanResult.create({
      data: {
        mirror: { connect: { id: data.mirrorId } },
        responseTimeMs: data.responseTimeMs,
        statusCode: data.statusCode,
        isAvailable: data.isAvailable,
        packageSizeBytes: data.packageSizeBytes,
      },
    });
  }
}
