import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

/**
 * TODO: Future enhancements could include:
 * - Whitelist of allowed file types can be implemented here
 */
@Controller('logs')
export class LogsController {
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

    return {
      message: 'Logs uploaded successfully',
      file: file.originalname,
      size: file.size,
      mime: file.mimetype,
      content: file.buffer.toString(),
    };
  }
}
