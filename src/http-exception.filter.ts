import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    response
      .status(status)
      .json({
        message: 'Failed',
        error_key: message['error_key'],
        error_message: isArray(message['message']) ? message['message'][0] : message['message'],
        error_data: {}
        // statusCode: status,
        // timestamp: new Date().toISOString(),
        // path: request.url,
      });
  }
}
