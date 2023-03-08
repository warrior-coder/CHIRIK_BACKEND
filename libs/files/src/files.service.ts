import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
    public async writeImageFile(file: Express.Multer.File): Promise<string> {
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const fileName = uuid.v4() + fileExtension;
        const filePath = path.join(__dirname, '..', '..', '..', 'static', 'images');
        const isPathExists = fs.existsSync(filePath);

        if (!isPathExists) {
            await fs.promises.mkdir(filePath, {
                recursive: true,
            });
        }

        fs.promises.writeFile(path.join(filePath, fileName), file.buffer);

        return fileName;
    }

    public removeImageFile(fileName: string): void {
        const filePath = path.join(__dirname, '..', '..', '..', 'static', 'images', fileName);
        const isPathExists = fs.existsSync(filePath);

        if (isPathExists) {
            fs.promises.rm(filePath);
        }
    }
}
