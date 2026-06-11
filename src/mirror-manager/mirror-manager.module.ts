import { Module } from '@nestjs/common';
import { MirrorManagerController } from './mirror-manager.controller';
import { MirrorManagerRepository } from './mirror-manager.repository';
import { MirrorManagerService } from './mirror-manager.service';

@Module({
  controllers: [MirrorManagerController],
  providers: [MirrorManagerRepository, MirrorManagerService],
  exports: [MirrorManagerRepository, MirrorManagerService],
})
export class MirrorManagerModule {}
