import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';
import { Request, Response } from 'express';
// import { MetricsService } from '../metrics.service';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  // Observable<any>: Nest normalizes all controller returns (sync, async, promise, object) into an Observable, so interceptors always deal with one consistent type.
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = process.hrtime.bigint(); // high-resolution time

    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const durationNs = process.hrtime.bigint() - now;
        const durationSec = Number(durationNs) / 1e9;

        const method = request.method;
        const route = request.route?.path || request.url; // template route is better
        const statusCode = response.statusCode;
        console.log('⚠️  Request Timing: ', durationSec, '| route :: ', route);
        this.metricsService.httpRequestDuration.observe(
          { method, route, status_code: statusCode },
          durationSec,
        );
      }),
    );
  }
}
