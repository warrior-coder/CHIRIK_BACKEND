import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 5000;

    // app.use((request: Request, response: Response, next: NextFunction) => {
    //     response.header('Access-Control-Allow-Origin', '*');
    //     response.header('Access-Control-Allow-Methods', 'GET, POST');
    //     response.header(
    //         'Access-Control-Allow-Headers',
    //         'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    //     );

    //     next();
    // });

    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    });

    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started on port ${port}...`);
    });
}

bootstrap();
