import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { LogsModule } from './logs/logs.module';
import { ConfigModule } from '@nestjs/config';
import { PineconeModule } from './shared/pinecone';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables from .env file
    HealthModule,
    PineconeModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
