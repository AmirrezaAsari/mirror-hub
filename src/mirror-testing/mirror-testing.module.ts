import { Module } from '@nestjs/common';
import { MirrorModule } from '../mirror/mirror.module';
import { MirrorHttpProbeClient } from './mirror-http-probe.client';
import { MirrorTestingController } from './mirror-testing.controller';
import { MirrorTestingService } from './mirror-testing.service';
import { ScanResultRepository } from './scan-result.repository';

@Module({
  imports: [MirrorModule],
  controllers: [MirrorTestingController],
  providers: [MirrorHttpProbeClient, ScanResultRepository, MirrorTestingService],
  exports: [MirrorTestingService],
})
export class MirrorTestingModule {}
