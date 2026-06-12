export const MIRROR_SCAN_SCHEDULER_QUEUE = 'mirror-scan-scheduler';
export const MIRROR_SPEED_TEST_QUEUE = 'mirror-speed-test';

export const MirrorScanJobName = {
  ScheduleTests: 'schedule-mirror-tests',
  TestMirror: 'test-mirror',
} as const;

export const MIRROR_SCAN_REPEAT_INTERVAL_MS = 60 * 60 * 1000;
export const MIRROR_SCAN_SCHEDULER_ID = 'mirror-scan-hourly';

export interface TestMirrorJobData {
  mirrorId: string;
}
