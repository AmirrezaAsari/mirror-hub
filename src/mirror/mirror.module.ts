import { Module } from '@nestjs/common';
import { MirrorManagerModule } from '../mirror-manager/mirror-manager.module';
import { MirrorController } from './mirror.controller';
import { MirrorRepository } from './mirror.repository';
import { MirrorService } from './mirror.service';

@Module({
  imports: [MirrorManagerModule],
  controllers: [MirrorController],
  providers: [MirrorRepository, MirrorService],
  exports: [MirrorRepository],
})
export class MirrorModule {}
