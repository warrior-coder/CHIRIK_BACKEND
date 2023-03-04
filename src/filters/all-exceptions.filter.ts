import { ForbiddenError } from '@casl/ability';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    public catch(exception: unknown, host: ArgumentsHost): void {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        let message: string;
        let statusCode: number;

        // determine the type of exception
        if (exception instanceof HttpException) {
            message = exception.message;
            statusCode = exception.getStatus();
        } else if (exception instanceof ForbiddenError) {
            message = exception.message;
            statusCode = HttpStatus.FORBIDDEN;
        } else if (exception instanceof Error) {
            message = exception.message;
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        } else {
            message = 'internal server error';
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        response.status(statusCode).json({
            statusCode,
            message,
            timestamp: Date.now(),
            path: request.url,
        });
    }
}
