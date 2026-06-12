import { Module, forwardRef } from '@nestjs/common';
import { MirrorManagerModule } from '../mirror-manager/mirror-manager.module';
import { ReportsModule } from '../reports/reports.module';
import { MirrorController } from './mirror.controller';
import { MirrorRepository } from './mirror.repository';
import { MirrorService } from './mirror.service';

@Module({
  imports: [MirrorManagerModule, forwardRef(() => ReportsModule)],
  controllers: [MirrorController],
  providers: [MirrorRepository, MirrorService],
  exports: [MirrorRepository],
})
export class MirrorModule {}
