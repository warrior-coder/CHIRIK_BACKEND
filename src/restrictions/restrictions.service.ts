import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { UsersEntity } from 'src/users/entities/users.entity';

import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class RestrictionsService {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public getAllUserRestrictions(user: UsersEntity): Promise<RestrictionsEntity[]> {
        if (!user) {
            throw new NotFoundException('user not found');
        }

        return this.restrictionsRepository.find({
            where: {
                initiatorUser: user,
            },
            relations: {
                targetUser: true,
            },
        });
    }

    public getRestrictionById(restrictionId: string): Promise<RestrictionsEntity | null> {
        return this.restrictionsRepository.findOneBy({ id: restrictionId });
    }

    public deleteRestriction(restriction: RestrictionsEntity): Promise<DeleteResult> {
        if (!restriction) {
            throw new NotFoundException('restriction not found');
        }

        return this.restrictionsRepository.delete(restriction);
    }
}
