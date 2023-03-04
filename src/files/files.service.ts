import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
    constructor(private configService: ConfigService) {}

    public async writeImageFile(file: Express.Multer.File): Promise<string> {
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (!this.isValidImageExtension(fileExtension)) {
            throw new BadRequestException('invalid image type');
        }

        const fileName = uuid.v4() + fileExtension;
        const filePath = path.join(__dirname, '..', '..', 'static', 'images');
        const isPathExists = fs.existsSync(filePath);

        if (!isPathExists) {
            await fs.promises.mkdir(filePath, { recursive: true });
        }

        await fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

        return fileName;
    }

    private isValidImageExtension(fileExtension: string): boolean {
        const imageExtensions = this.configService.get<string>('IMAGE_EXTENSIONS').toLowerCase().split(' ');

        return imageExtensions.includes(fileExtension.toLowerCase());
    }

    public removeImageFile(fileName: string): Promise<void> | void {
        const filePath = path.join(__dirname, '..', '..', 'static', 'images', fileName);
        const isPathExists = fs.existsSync(filePath);

        if (isPathExists) {
            return fs.promises.rm(filePath);
        }
    }
}
