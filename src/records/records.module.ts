import { Module } from '@nestjs/common';

import { FilesModule } from '@app/files';
import { RestrictionsModule } from 'src/restrictions/restrictions.module';
import { UsersModule } from 'src/users/users.module';

import { CommentsController } from './controllers/comments.controller';
import { RecordsController } from './controllers/records.controller';
import { CommentsService } from './services/comments.service';
import { RecordsService } from './services/records.service';

@Module({
    controllers: [RecordsController, CommentsController],
    providers: [RecordsService, CommentsService],
    imports: [UsersModule, FilesModule, RestrictionsModule],
})
export class RecordsModule {}
