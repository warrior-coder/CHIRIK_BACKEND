import { Module } from '@nestjs/common';

import { FilesModule } from '@app/files';
import { RestrictionsModule } from 'src/restrictions/restrictions.module';
import { UsersModule } from 'src/users/users.module';

import { CommentsController } from './controllers/comments.controller';
import { LikesController } from './controllers/likes.controller';
import { RecordsController } from './controllers/records.controller';
import { CommentsService } from './services/comments.service';
import { LikesService } from './services/likes.service';
import { RecordsService } from './services/records.service';

@Module({
    controllers: [RecordsController, CommentsController, LikesController],
    providers: [RecordsService, CommentsService, LikesService],
    imports: [UsersModule, FilesModule, RestrictionsModule],
})
export class RecordsModule {}
