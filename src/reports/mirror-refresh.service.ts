import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  PACKAGE_TO_MANAGER_TYPE,
  PackageType,
} from '../common/constants/package-type';
import { MirrorRepository } from '../mirror/mirror.repository';
import {
  MIRROR_SPEED_TEST_QUEUE,
  MirrorScanJobName,
} from '../mirror-scan/mirror-scan.constants';

@Injectable()
export class MirrorRefreshService {
  private readonly logger = new Logger(MirrorRefreshService.name);

  constructor(
    private readonly mirrorRepository: MirrorRepository,
    @InjectQueue(MIRROR_SPEED_TEST_QUEUE)
    private readonly speedTestQueue: Queue,
  ) {}

  async queuePackageRefresh(packageType: PackageType): Promise<number> {
    const managerType = PACKAGE_TO_MANAGER_TYPE[packageType];
    const mirrors = await this.mirrorRepository.findAllActiveByManagerType(managerType);

    if (mirrors.length === 0) {
      this.logger.warn(`No active mirrors found for package type "${packageType}"`);
      return 0;
    }

    await this.speedTestQueue.addBulk(
      mirrors.map((mirror) => ({
        name: MirrorScanJobName.TestMirror,
        data: { mirrorId: mirror.id },
        opts: {
          jobId: `manual-refresh-${mirror.id}-${Date.now()}`,
        },
      })),
    );

    this.logger.log(`Queued ${mirrors.length} speed test(s) for package "${packageType}"`);
    return mirrors.length;
  }
}
