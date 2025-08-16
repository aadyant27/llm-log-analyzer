import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LogsSummarizer } from './logic/logs-summarize.service';
import { ConfigService } from '@nestjs/config';
import { LangchainPineconeService, PineconeService } from 'src/shared/pinecone';
import { LogsPineconeMapper } from './logic/logs-pinecone.mapper';

@Module({
  controllers: [LogsController],
  providers: [
    ConfigService,
    LogsService,
    LogsSummarizer,
    PineconeService,
    LangchainPineconeService,
    LogsPineconeMapper,
  ],
})
export class LogsModule {}
