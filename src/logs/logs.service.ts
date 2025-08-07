import { Injectable } from '@nestjs/common';

/**
 * TODO:
 * ------
 * - Add types
 * - Lint rules, pre-commit hooks so any type errors are caught early
 * - Logger service for better logging
 *
 */

export interface ParsedLog {
  requestId: string;
  timestamp: string;
  level: string; // 'INFO', 'WARN', 'ERROR', etc
  pingcode: string;
  message: string;
  raw: string; // the original line
}

export interface ChunkedLogs {
  requestId: string;
  level: string; // Make it enum
  entries: ParsedLog[];
}
@Injectable()
export class LogsService {
  processLogFile(rawContent: string, metadata: any) {
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

    const { Keys, chunkLogs } = this.chunkLogs(parsedLogs);
    return {
      Keys,
      chunkLogs,
      size: chunkLogs.length,
      metadata,
      Orignalsize: parsedLogs.length,
    };
  }

  // Group related log entries into semantic chunks so that each chunk represents a meaningful unit(like a request lifecycle or a user session)
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
