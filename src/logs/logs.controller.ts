import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogsService } from './logs.service';

/**
 * TODO:
 * ------
 * - Whitelist of allowed file types can be implemented here
 * - Use stream processing for large files
 * - Send files to s3
 */
@Controller('logs')
export class LogsController {
  constructor(private readonly LogsService: LogsService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB max
    }),
  )
  uploadLogs(@UploadedFile() file: Express.Multer.File) {
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
    return this.LogsService.processLogFile(content, metadata);
  }
}
