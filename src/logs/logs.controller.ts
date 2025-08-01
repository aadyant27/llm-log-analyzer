import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('logs')
export class LogsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadLogs(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    return {
      message: 'Logs uploaded successfully',
      file: file.originalname,
      size: file.size,
      content: file.buffer.toString(),
    };
  }
}
