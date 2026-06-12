import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MirrorModule } from '../mirror/mirror.module';
import { MirrorTestingModule } from '../mirror-testing/mirror-testing.module';
import { MirrorScanSchedulerService } from './mirror-scan-scheduler.service';
import { MIRROR_SCAN_SCHEDULER_QUEUE, MIRROR_SPEED_TEST_QUEUE } from './mirror-scan.constants';
import { MirrorScanSchedulerProcessor } from './processors/mirror-scan-scheduler.processor';
import { MirrorSpeedTestProcessor } from './processors/mirror-speed-test.processor';

@Module({
  imports: [
    MirrorModule,
    MirrorTestingModule,
    BullModule.registerQueue(
      {
        name: MIRROR_SCAN_SCHEDULER_QUEUE,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 10_000 },
          removeOnComplete: 50,
          removeOnFail: 100,
        },
      },
      {
        name: MIRROR_SPEED_TEST_QUEUE,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: 200,
          removeOnFail: 500,
        },
      },
    ),
    BullBoardModule.forFeature(
      {
        name: MIRROR_SCAN_SCHEDULER_QUEUE,
        adapter: BullMQAdapter,
      },
      {
        name: MIRROR_SPEED_TEST_QUEUE,
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [MirrorScanSchedulerService, MirrorScanSchedulerProcessor, MirrorSpeedTestProcessor],
})
export class MirrorScanModule {}
