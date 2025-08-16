import { Injectable } from '@nestjs/common';
import { VectorDocument } from 'src/shared/pinecone/types/pinecone.interface';
import { ChunkedLogs } from '../types/logs.interface';

@Injectable()
export class LogsPineconeMapper {
  toVectorDocuments(errorChunks: ChunkedLogs[]): VectorDocument[] {
    return errorChunks.map((chunk) => ({
      pageContent: chunk.entries
        .map((entry) => `[${entry.timestamp}] ${entry.level}: ${entry.message}`)
        .join('\n'),
      metadata: {
        requestId: chunk.requestId,
        level: chunk.level,
        totalEntries: chunk.entries.length,
        timestamps: chunk.entries.map((e) => e.timestamp),
      },
    }));
  }
}
