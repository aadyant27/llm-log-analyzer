import { Injectable } from '@nestjs/common';
import { PineconeService } from './pinecone.service';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { ConfigService } from '@nestjs/config';
import { VectorDocument } from './types/pinecone.interface';

@Injectable()
export class LangchainPineconeService {
  constructor(
    private readonly pineconeService: PineconeService,
    private readonly configService: ConfigService,
  ) {}

  async addDocuments(documents: VectorDocument[]) {
    const index = this.pineconeService.getIndex();
    console.log('✅ docs', documents.length, index);
    // Creating instance of pinecone index(table) where we want to store our embeddings
    try {
      const store = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({
          model: 'text-embedding-3-small',
          apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        }),
        { pineconeIndex: index },
      );

      const x = await store.addDocuments(documents);
      console.log('🔥 Added documents to Pinecone', x);

      console.log(`✅ Added ${documents.length} docs to Pinecone`);
    } catch (error) {
      console.error('❌ Error adding documents to Pinecone:', error);
      throw error;
    }
  }

  async search(query: string, topK = 1) {
    const index = this.pineconeService.getIndex();

    // Creating instance of pinecone index(table) where we want to store our embeddings
    const store = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      }),
      { pineconeIndex: index },
    );
    const stats = await index.describeIndexStats();
    console.log('index stats:', stats);

    return store.similaritySearch(query, topK);
  }
}
