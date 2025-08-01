import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [HealthModule, LogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
