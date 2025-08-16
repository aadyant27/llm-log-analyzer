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

export interface LogsSummary {
  requestId: string;
  level: string; // Make it enum
  summary: string;
}

export interface Response {
  message: string;
  generateImmediateSummary: boolean;
  summary: LogsSummary[];
}
