import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth() {
    console.info('[INFO] Health check endpoint hit');
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
