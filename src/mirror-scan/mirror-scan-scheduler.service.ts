import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  MIRROR_SCAN_REPEAT_INTERVAL_MS,
  MIRROR_SCAN_SCHEDULER_ID,
  MIRROR_SCAN_SCHEDULER_QUEUE,
  MirrorScanJobName,
} from './mirror-scan.constants';

@Injectable()
export class MirrorScanSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(MirrorScanSchedulerService.name);

  constructor(
    @InjectQueue(MIRROR_SCAN_SCHEDULER_QUEUE)
    private readonly schedulerQueue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.schedulerQueue.upsertJobScheduler(
      MIRROR_SCAN_SCHEDULER_ID,
      { every: MIRROR_SCAN_REPEAT_INTERVAL_MS },
      {
        name: MirrorScanJobName.ScheduleTests,
        data: {},
        opts: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 10_000 },
          removeOnComplete: 50,
          removeOnFail: 100,
        },
      },
    );

    this.logger.log(
      `Registered hourly mirror scan scheduler (every ${MIRROR_SCAN_REPEAT_INTERVAL_MS / 1000 / 60} minutes)`,
    );
  }
}
