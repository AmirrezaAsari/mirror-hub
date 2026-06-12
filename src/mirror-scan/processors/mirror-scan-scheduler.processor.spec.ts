import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bullmq';
import { MirrorRepository } from '../../mirror/mirror.repository';
import { MIRROR_SPEED_TEST_QUEUE, MirrorScanJobName } from '../mirror-scan.constants';
import { MirrorScanSchedulerProcessor } from './mirror-scan-scheduler.processor';

describe('MirrorScanSchedulerProcessor', () => {
  let processor: MirrorScanSchedulerProcessor;

  const mirrorRepository = {
    findAllActive: jest.fn(),
  };

  const speedTestQueue = {
    addBulk: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MirrorScanSchedulerProcessor,
        { provide: MirrorRepository, useValue: mirrorRepository },
        { provide: getQueueToken(MIRROR_SPEED_TEST_QUEUE), useValue: speedTestQueue },
      ],
    }).compile();

    processor = module.get(MirrorScanSchedulerProcessor);
  });

  it('enqueues speed test jobs for all active mirrors', async () => {
    mirrorRepository.findAllActive.mockResolvedValue([{ id: 'mirror-1' }, { id: 'mirror-2' }]);
    speedTestQueue.addBulk.mockResolvedValue([]);

    const job = { name: MirrorScanJobName.ScheduleTests, data: {} } as Job;

    await processor.process(job);

    expect(speedTestQueue.addBulk).toHaveBeenCalledWith([
      expect.objectContaining({
        name: MirrorScanJobName.TestMirror,
        data: { mirrorId: 'mirror-1' },
      }),
      expect.objectContaining({
        name: MirrorScanJobName.TestMirror,
        data: { mirrorId: 'mirror-2' },
      }),
    ]);
  });

  it('does not enqueue jobs when no active mirrors exist', async () => {
    mirrorRepository.findAllActive.mockResolvedValue([]);

    const job = { name: MirrorScanJobName.ScheduleTests, data: {} } as Job;

    await processor.process(job);

    expect(speedTestQueue.addBulk).not.toHaveBeenCalled();
  });
});
