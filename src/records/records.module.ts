import { FilesModule } from '@app/files';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';

import { CommentsController } from './controllers/comments.controller';
import { RecordsController } from './controllers/records.controller';
import { RecordCommentsEntity } from './entities/record-comments.entity';
import { RecordImagesEntity } from './entities/record-images.entity';
import { RecordLikesEntity } from './entities/record-likes.entity';
import { RecordsEntity } from './entities/records.entity';
import { CommentsService } from './services/comments.service';
import { RecordsService } from './services/records.service';

@Module({
    controllers: [RecordsController, CommentsController],
    providers: [RecordsService, CommentsService],
    imports: [
        TypeOrmModule.forFeature([
            RecordsEntity,
            UsersEntity,
            RecordImagesEntity,
            RecordLikesEntity,
            RecordCommentsEntity,
        ]),
        UsersModule,
        RecordsModule,
        FilesModule,
    ],
})
export class RecordsModule {}
