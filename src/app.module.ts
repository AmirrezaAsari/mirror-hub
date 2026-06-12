import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { MirrorManagerModule } from './mirror-manager/mirror-manager.module';
import { MirrorScanModule } from './mirror-scan/mirror-scan.module';
import { MirrorTestingModule } from './mirror-testing/mirror-testing.module';
import { MirrorModule } from './mirror/mirror.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
          password: configService.get<string>('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    HealthModule,
    MirrorManagerModule,
    MirrorModule,
    MirrorTestingModule,
    MirrorScanModule,
    ReportsModule,
  ],
})
export class AppModule {}
