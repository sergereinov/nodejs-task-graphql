import { GraphQLError } from 'graphql/error';
import { DBApi } from '../../../utils/DB/DBApi';
import { UserEntity, CreateUserDTO } from '../../../utils/DB/entities/DBUsers';
import * as postsResolver from './posts';
import * as profilesResolver from './profiles';
import * as memberTypesResolver from './member-types';

/**
 * Users resolvers and wrappers
 */

/**
 * Wrap user object to match GraphQL schema `type User`
 */
export const wrapUser = (user: UserEntity) => ({
    ...user,

    subscribedToUser: async ({ }, adb: DBApi) =>
        user.subscribedToUserIds.map(async (userId) => await adb.users.getById(userId)),

    userSubscribedTo: async ({ }, adb: DBApi) =>
        (await adb.users.getSubscribedTo(user.id)).map((e) => wrapUser(e)),
        
    posts: async ({ }, adb: DBApi) => postsResolver.postsByUserId(user.id, adb),
    profile: async ({ }, adb: DBApi) => profilesResolver.profileByUserId(user.id, adb),
    memberType: async ({ }, adb: DBApi) => memberTypesResolver.memberTypeByUserId(user.id, adb),
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
