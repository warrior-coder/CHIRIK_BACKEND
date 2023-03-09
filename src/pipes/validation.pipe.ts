import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any, any> {
    public transform(value: any, metadata: ArgumentMetadata): any {
        return value;
    }
}
