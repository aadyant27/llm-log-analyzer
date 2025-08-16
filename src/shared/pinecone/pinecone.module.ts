import { Module } from '@nestjs/common';
import { PineconeService } from './pinecone.service';
import { LangchainPineconeService } from './langchain-pinecone.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService, PineconeService, LangchainPineconeService],
  exports: [PineconeService, LangchainPineconeService],
})
export class PineconeModule {}
