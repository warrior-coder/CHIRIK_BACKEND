import { Injectable } from '@nestjs/common';
import { ServeStaticModuleOptions, ServeStaticModuleOptionsFactory } from '@nestjs/serve-static';
import * as path from 'path';

@Injectable()
export class ServeStaticConfig implements ServeStaticModuleOptionsFactory {
    public createLoggerOptions(): Promise<ServeStaticModuleOptions[]> | ServeStaticModuleOptions[] {
        return [
            {
                rootPath: path.join(__dirname, '..', 'static'),
            },
        ];
    }
}
