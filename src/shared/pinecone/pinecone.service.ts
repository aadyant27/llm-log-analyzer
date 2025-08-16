import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
/**
 * We use onModuleInit because we need to create and store the Pinecone client once when the app starts, so that:
 *  - We don’t create a new client object every time a service calls Pinecone.
 *  - The connection/config is ready before other services (like LangchainPineconeService) use it.
 */
export class PineconeService implements OnModuleInit {
  public client: Pinecone;
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY'),
    });
    console.info('[INFO]: ✅ Pinecone client initialized');
  }

  getIndex() {
    return this.client.index(
      this.configService.get<string>('PINECONE_INDEX_NAME'),
    );
  }
}
