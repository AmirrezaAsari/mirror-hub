import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { MirrorRepository } from '../../mirror/mirror.repository';
import {
  MIRROR_SPEED_TEST_QUEUE,
  MIRROR_SCAN_SCHEDULER_QUEUE,
  MirrorScanJobName,
  TestMirrorJobData,
} from '../mirror-scan.constants';

@Processor(MIRROR_SCAN_SCHEDULER_QUEUE)
export class MirrorScanSchedulerProcessor extends WorkerHost {
  private readonly logger = new Logger(MirrorScanSchedulerProcessor.name);

  constructor(
    private readonly mirrorRepository: MirrorRepository,
    @InjectQueue(MIRROR_SPEED_TEST_QUEUE)
    private readonly speedTestQueue: Queue<TestMirrorJobData>,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== MirrorScanJobName.ScheduleTests) {
      this.logger.warn(`Skipping unsupported job name "${job.name}"`);
      return;
    }

    const mirrors = await this.mirrorRepository.findAllActive();
    this.logger.log(`Scheduling speed tests for ${mirrors.length} active mirror(s)`);

    if (mirrors.length === 0) {
      return;
    }

    await this.speedTestQueue.addBulk(
      mirrors.map((mirror) => ({
        name: MirrorScanJobName.TestMirror,
        data: { mirrorId: mirror.id },
        opts: {
          jobId: `mirror-speed-test-${mirror.id}-${Date.now()}`,
        },
      })),
    );

    this.logger.log(`Enqueued ${mirrors.length} mirror speed test job(s)`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error): void {
    this.logger.error(
      `Scheduler job ${job?.id ?? 'unknown'} failed: ${error.message}`,
      error.stack,
    );
  }
}
