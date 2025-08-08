import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LogsSummarizer } from './logic/logs-summarize.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [LogsController],
  providers: [LogsService, LogsSummarizer, ConfigService],
})
export class LogsModule {}
