import { Injectable } from '@nestjs/common';
import { LogsSummarizer } from './logic/logs-summarize.service';
import { ChunkedLogs, ParsedLog, LogsSummary } from './types/logs.interface';
import { LangchainPineconeService } from 'src/shared/pinecone';
import { LogsPineconeMapper } from './logic/logs-pinecone.mapper';

/**
 * TODO:
 * Only public methods attached to the controller should be here.
 * Rest of the methods should be in /logic.
 * */
@Injectable()
export class LogsService {
  constructor(
    private readonly summarizer: LogsSummarizer,
    private langchainPinecone: LangchainPineconeService,
    private logsMapper: LogsPineconeMapper,
  ) {}
  async handler(rawContent: string, summarize: boolean) {
    // Process the raw content and return the summary
    // return await this.processLogFile(rawContent);

    const errorChunks = await this.processLogFile(rawContent);
    if (errorChunks.length === 0) {
      return {
        message: 'No errors found in the logs.',
        generateImmediateSummary: summarize,
        summary: [],
      };
    }

    let summary: LogsSummary[] = [];
    if (summarize) {
      summary = await this.summarizer.summarizeLogs(errorChunks);
    }

    // console.log('🔥 ERROR CHUNKS', errorChunks);

    this.generateVectorEmbeddings(errorChunks);
    return {
      message: 'Embeddings created successfully.',
      generateImmediateSummary: summarize,
      summary: summary,
    };
  }

  async generateVectorEmbeddings(errorChunks: ChunkedLogs[]) {
    const docs = this.logsMapper.toVectorDocuments(errorChunks);
    console.log('🔥 Vector Documents', docs);
    // await this.langchainPinecone.addDocuments(docs);
    // console.log(`✅ Added ${docs.length} docs to Pinecone`);
  }

  async processLogFile(rawContent: string) {
    // Split the raw content into lines
    const content = rawContent.split('\n');
    const parsedLogs: ParsedLog[] = [];

    // Parsing each line and extracting relevant fields
    content.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        // Skip empty lines
        return;
      }
      const parsedLines = JSON.parse(trimmed);
      parsedLogs.push({
        requestId: parsedLines.extra.extra?.xRequestId ?? '',
        timestamp: parsedLines.extra.timestamp ?? '',
        level: parsedLines.level,
        pingcode: parsedLines.extra.extra.pingcode,
        message: parsedLines.message,
        raw: trimmed,
      });
    });

    const { chunkLogs } = this.chunkLogs(parsedLogs);
    const errorChunks = chunkLogs.filter((c) => c.level === 'error');
    return errorChunks;
  }

  // Group related log entries into semantic chunks so that each chunk represents a meaningful unit
  private chunkLogs(parsedLogs: ParsedLog[]) {
    const chunkLogs = new Map<string, ChunkedLogs>();
    let currentRequestId: string | null = null;
    parsedLogs.forEach((log) => {
      const { requestId, level } = log;
      if (requestId) {
        currentRequestId = requestId;
      }

      const key = `${currentRequestId}-${level}`;
      if (!chunkLogs.has(key)) {
        chunkLogs.set(key, {
          requestId: currentRequestId,
          level: level,
          entries: [],
        });
      }
      chunkLogs.get(key)!.entries.push(log);
    });
    return {
      Keys: Array.from(chunkLogs.keys()),
      chunkLogs: Array.from(chunkLogs.values()),
    };
  }
}
