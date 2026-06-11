import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { MirrorManagerModule } from './mirror-manager/mirror-manager.module';
import { MirrorTestingModule } from './mirror-testing/mirror-testing.module';
import { MirrorModule } from './mirror/mirror.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HealthModule,
    MirrorManagerModule,
    MirrorModule,
    MirrorTestingModule,
  ],
})
export class AppModule {}
