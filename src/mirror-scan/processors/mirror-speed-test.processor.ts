import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MirrorTestingService } from '../../mirror-testing/mirror-testing.service';
import {
  MIRROR_SPEED_TEST_QUEUE,
  MirrorScanJobName,
  TestMirrorJobData,
} from '../mirror-scan.constants';

@Processor(MIRROR_SPEED_TEST_QUEUE, { concurrency: 5 })
export class MirrorSpeedTestProcessor extends WorkerHost {
  private readonly logger = new Logger(MirrorSpeedTestProcessor.name);

  constructor(private readonly mirrorTestingService: MirrorTestingService) {
    super();
  }

  async process(job: Job<TestMirrorJobData>): Promise<void> {
    if (job.name !== MirrorScanJobName.TestMirror) {
      this.logger.warn(`Skipping unsupported job name "${job.name}"`);
      return;
    }

    const { mirrorId } = job.data;
    this.logger.log(
      `Running speed test for mirror ${mirrorId} (attempt ${job.attemptsMade + 1}/${job.opts.attempts ?? 1})`,
    );

    const result = await this.mirrorTestingService.testMirror(mirrorId);

    this.logger.log(
      `Mirror ${mirrorId} speed test finished: status=${result.statusCode}, responseTime=${result.responseTimeMs}ms, available=${result.isAvailable}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<TestMirrorJobData>): void {
    this.logger.debug(`Job ${job.id} completed for mirror ${job.data.mirrorId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<TestMirrorJobData> | undefined, error: Error): void {
    const mirrorId = job?.data.mirrorId ?? 'unknown';
    this.logger.error(
      `Job ${job?.id ?? 'unknown'} failed for mirror ${mirrorId}: ${error.message}`,
      error.stack,
    );
  }
}
