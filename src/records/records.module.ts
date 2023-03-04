import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilesModule } from 'src/files/files.module';
import { RestrictionsEntity } from 'src/restrictions/restrictions.entity';
import { RestrictionsModule } from 'src/restrictions/restrictions.module';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';

import { CommentsController } from './controllers/comments.controller';
import { RecordsController } from './controllers/records.controller';
import { RetweetsController } from './controllers/retweets.controller';
import { TweetsController } from './controllers/tweets.controller';
import { RecordImagesEntity } from './entities/record-images.entity';
import { RecordLikesEntity } from './entities/record-likes.entity';
import { RecordsEntity } from './entities/records.entity';
import { CommentsService } from './services/comments.service';
import { RecordsService } from './services/records.service';
import { RetweetsService } from './services/retweets.service';
import { TweetsService } from './services/tweets.service';

@Module({
    controllers: [TweetsController, CommentsController, RetweetsController, RecordsController],
    providers: [RecordsService, TweetsService, RetweetsService, CommentsService],
    imports: [
        TypeOrmModule.forFeature([
            RecordsEntity,
            UsersEntity,
            RecordImagesEntity,
            RestrictionsEntity,
            RecordLikesEntity,
        ]),
        UsersModule,
        RecordsModule,
        FilesModule,
        RestrictionsModule,
    ],
})
export class RecordsModule {}
