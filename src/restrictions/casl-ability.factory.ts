import { AbilityBuilder, MongoAbility, PureAbility, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/interfaces/permission.interface';
import { UsersEntity } from 'src/users/entities/users.entity';

import { defaultPermissions } from './default-permissions';
import { RestrictionsEntity } from './restrictions.entity';

@Injectable()
export class CaslAbilityFactory {
    constructor(
        @InjectRepository(RestrictionsEntity) private readonly restrictionsRepository: Repository<RestrictionsEntity>,
    ) {}

    public defineAbilityToReadTweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): Promise<PureAbility> {
        return this.defineVisitorAbility(targetUser, targetUserRoles, initiatorUser, 'read', 'tweets');
    }

    public defineAbilityToReadComments(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): Promise<PureAbility> {
        return this.defineVisitorAbility(targetUser, targetUserRoles, initiatorUser, 'read', 'comments');
    }

    public defineAbilityToReadRetweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): Promise<PureAbility> {
        return this.defineVisitorAbility(targetUser, targetUserRoles, initiatorUser, 'read', 'retweets');
    }

    public defineAbilityToCreateComments(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): Promise<PureAbility> {
        return this.defineVisitorAbility(targetUser, targetUserRoles, initiatorUser, 'create', 'comments');
    }

    public defineAbilityToCreateRetweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): Promise<PureAbility> {
        return this.defineVisitorAbility(targetUser, targetUserRoles, initiatorUser, 'create', 'retweets');
    }

    public defineAbilityToDeleteTweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): PureAbility {
        return this.defineOwnerAbility(targetUser, targetUserRoles, initiatorUser, 'delete', 'tweets');
    }

    public defineAbilityToDeleteComments(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): PureAbility {
        return this.defineOwnerAbility(targetUser, targetUserRoles, initiatorUser, 'delete', 'comments');
    }

    public defineAbilityToDeleteRetweets(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
    ): PureAbility {
        return this.defineOwnerAbility(targetUser, targetUserRoles, initiatorUser, 'delete', 'retweets');
    }

    public defineOwnerAbility(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
        action: string,
        subject: string,
    ): PureAbility {
        const { build, can } = new AbilityBuilder<MongoAbility>(createMongoAbility);

        if (targetUserRoles.includes('admin')) {
            can(action, subject);
        } else {
            if (targetUser.id === initiatorUser.id) {
                can(action, subject);
            }
        }

        return build();
    }

    public async defineVisitorAbility(
        targetUser: UsersEntity,
        targetUserRoles: Array<string>,
        initiatorUser: UsersEntity,
        action: string,
        subject: string,
    ): Promise<PureAbility> {
        const { build, can } = new AbilityBuilder<MongoAbility>(createMongoAbility);

        if (targetUserRoles.includes('admin')) {
            can(action, subject);
        } else {
            const isRestrictionExist = await this.restrictionsRepository.exist({
                where: {
                    targetUser,
                    initiatorUser,
                    action,
                    subject,
                },
            });

            if (!isRestrictionExist) {
                can(action, subject);
            }
        }

        return build();
    }
}
