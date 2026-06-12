import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MirrorModule } from '../mirror/mirror.module';
import { MIRROR_SPEED_TEST_QUEUE } from '../mirror-scan/mirror-scan.constants';
import { MirrorRefreshService } from './mirror-refresh.service';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

@Module({
  imports: [forwardRef(() => MirrorModule), BullModule.registerQueue({ name: MIRROR_SPEED_TEST_QUEUE })],
  controllers: [ReportsController],
  providers: [ReportsRepository, ReportsService, MirrorRefreshService],
  exports: [ReportsService],
})
export class ReportsModule {}
