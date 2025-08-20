import { OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Histogram, Registry } from 'prom-client';

export class MetricsService implements OnModuleInit {
  private registry: Registry;
  httpRequestDuration: Histogram<string>;

  onModuleInit() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });
    // Example: HTTP request duration histogram
    this.httpRequestDuration = new Histogram({
      name: 'http_server_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.3, 1, 3, 10], // custom buckets
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
