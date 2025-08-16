import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogsService } from './logs.service';
import { LangchainPineconeService } from 'src/shared/pinecone';

@Controller('logs')
export class LogsController {
  constructor(
    private readonly LogsService: LogsService,
    private langchainPinecone: LangchainPineconeService,
  ) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB max
    }),
  )
  async uploadLogs(
    @UploadedFile() file: Express.Multer.File,
    @Query('summarizeImmediately') summarizeImmediately: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    if (!file.mimetype || !file.mimetype.startsWith('text/')) {
      throw new BadRequestException(
        'Invalid file type. Only text files are allowed.',
      );
    }

    const content = file.buffer.toString();
    const metadata = {
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
    if (!content) {
      throw new BadRequestException('File is empty.');
    }

    const summarize =
      typeof summarizeImmediately === 'string'
        ? summarizeImmediately.toLowerCase() === 'true'
        : false;
    return await this.LogsService.handler(content, summarize);
  }

  @Get()
  async getLogs() {
    // This endpoint can be used to retrieve logs if needed
    const res = await this.langchainPinecone.search(
      'cash-facility-advanced-overdraft-contracts?offset=100&limit=200',
    );

    return {
      message: res,
    };
  }
}
