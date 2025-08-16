import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { estimateLLMCost } from '../utils/llm-cost-estimator';
import { ChunkedLogs } from '../types/logs.interface';

@Injectable()
export class LogsSummarizer {
  private openAI: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openAI = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async summarizeLogs(chunks: ChunkedLogs[]): Promise<any> {
    const summaries = Promise.all(
      chunks.map(async (chunk) => {
        // For each chunk, we create a prompt
        if (chunk.level === 'error') {
          const prompt = this.buildPrompt(chunk);
          const summary = await this.callOpenAI(prompt);
          return {
            requestId: chunk.requestId,
            level: chunk.level,
            summary,
          };
        }
      }),
    );
    return summaries;
  }
  private buildPrompt(chunk: ChunkedLogs): string {
    const logLines = chunk.entries.map((e) => e.raw).join('\n');
    return `
      SYSTEM:
        You are a Backend Log Summarizer. Your audience includes backend engineers, QA, and on-call SREs who may have no prior context.

        TASK:
        Summarize the following log entries captured during a single logical operation or request.

        INSTRUCTIONS:
        1. **High-Level Summary**: In 1–2 sentences, explain what the system was trying to do and the overall outcome.
        2. **Root Cause**: Always include the full, exact exception or error message (e.g.  
        \`TypeError: Cannot read properties of undefined (reading 'legalType')\`).
        3. **Error Context**:
        - **Class/Module/Function**: Extract service or class name (e.g., \`ComputeAvailableOverdraftLimitService\`).
        - **File & Line**: If a stack trace is present, show the top 2–3 lines with file paths and line numbers.
        - **Endpoint(s)**: List any HTTP routes or RPC methods hit.
        4. **Entities Affected**:
        - **Accounts / IDs**: Deduplicate and list unique account numbers or request IDs.
        5. **Timestamps**:
        - Show the timestamp of the very first error and the last error in ISO 8601.
        6. **Grouping & Patterns**:
        - If the same error repeats (e.g., “No active CFAO contract found”), group it into a single bullet with a count.
        7. **Actionable Insight**:
        - At the end, add one sentence suggesting next debugging steps or likely data causes.
        NOTE:
        - No error should be left unaddressed.
        - If some entites are affected, list all of them.
        - After creating summary, analyse the summary created and if you infer some additional information from summary, (for example, if you see duplicated IDs) add an extra note. If no addtional information is inferred, just write "No additional insights from the summary".

    FORMAT (Markdown):
        Summary: <plain-English overview>
        Root Cause: <exact exception string>
        Error Context:
          - Class/Module/Function: <name>
          - File & Line: <file path and line number>
          - Endpoint(s): <list of endpoints>
          - Stack Trace:
                1. <path/to/file.js:line:col> – <function or message>
                2. …
        - Endpoints: [<endpoint1>, <endpoint2>]
        - Entities Affected: [<account1>, <account2>]
        - Timestamps: [<first error timestamp>, <last error timestamp>]
        - Debug hints: <one sentence on likely cause or next step>
        - Extra Notes: <any additional insights from the summary>


    LOGS:
    ${logLines}`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await this.openAI.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    // console.log('✅ OpenAI response:', response);
    estimateLLMCost(
      response.model,
      response.usage.prompt_tokens,
      response.usage.completion_tokens,
    );

    return response.choices[0].message.content || 'No summary generated';
  }
}
