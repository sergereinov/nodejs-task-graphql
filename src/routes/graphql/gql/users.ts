import { GraphQLError } from 'graphql/error';
import { DBApi } from '../../../utils/DB/DBApi';
import { UserEntity, CreateUserDTO, ChangeUserDTO } from '../../../utils/DB/entities/DBUsers';
import * as postsResolver from './posts';
import * as profilesResolver from './profiles';
import * as memberTypesResolver from './member-types';

/**
 * Users resolvers and wrappers
 */

/**
 * Wrap user object to match GraphQL schema `type User`
 */
export const wrapUser = (userEntity: UserEntity) => ({
    ...userEntity,

    subscribedToUser: async ({ }, adb: DBApi) =>
        userEntity.subscribedToUserIds.map(async (userId) =>
            user(userId, adb) //user resolver from below
        ),

    userSubscribedTo: async ({ }, adb: DBApi) =>
        (await adb.users.getSubscribedTo(userEntity.id)).map((e) => wrapUser(e)),

    posts: async ({ }, adb: DBApi) => postsResolver.postsByUserId(userEntity.id, adb),
    profile: async ({ }, adb: DBApi) => profilesResolver.profileByUserId(userEntity.id, adb),
    memberType: async ({ }, adb: DBApi) => memberTypesResolver.memberTypeByUserId(userEntity.id, adb),
});

export const users = async (adb: DBApi) =>
    (await adb.users.getAll()).map((u) => wrapUser(u));

export const user = async (userId: string, adb: DBApi) => {
    const u = await adb.users.getById(userId);
    if (!u) return new GraphQLError('user not found');
    return wrapUser(u);
}

export const createUser = async (dto: CreateUserDTO, adb: DBApi) =>
    wrapUser(await adb.users.create(dto));

export const updateUser = async (userId: string, dto: ChangeUserDTO, adb: DBApi) =>
    wrapUser(await adb.users.update(userId, dto));

export const subscribeTo = async (
    userId: string,
    subscribesToUserId: string,
    adb: DBApi
) => {
    const u = await adb.users.subscribeTo(userId, subscribesToUserId);
    if (!u) return new GraphQLError('subscribed user not found');
    return wrapUser(u);
}

export const unsubscribeFrom = async (
    userId: string,
    unsubscribesFromUserId: string,
    adb: DBApi
) => {
    const u = await adb.users.unsubscribeFrom(userId, unsubscribesFromUserId);
    if (!u) return new GraphQLError('subscribed user not found');
    return wrapUser(u);
};
