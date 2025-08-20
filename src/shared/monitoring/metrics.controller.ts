import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    /**
     * Prometheus expects metrics in a very specific format
     * If we don't set the content type, it will not be able to parse the metrics correctly as NEST.js will set it to 'application/json' by default and also serialize the response.
     * This is why we set the content type to 'text/plain'
     *
     * We explicitly set the header because:
     * Prometheus’ scraper checks the MIME type
     * - Content-Type must be text/plain; version=0.0.4 (Prometheus defaults to parsing plain text).
     * - If we don’t set the header, Express/NestJS might default it to application/json or text/html.
     *
     * */
    res.setHeader('Content-Type', 'text/plain');
    res.send(await this.metricsService.getMetrics());
  }
}
