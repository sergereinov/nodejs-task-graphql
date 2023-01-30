import { GraphQLError } from 'graphql/error';
import { DBApi } from "../../../utils/DB/DBApi";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import * as usersResolver from './users';
import * as memberTypesResolver from './member-types';


/**
 * Profiles resolvers and wrappers
 */

/**
 * Wrap profile object to match GraphQL schema `type Profile`
 */
export const wrapProfile = (profile: ProfileEntity) => ({
    ...profile,
    memberType: async ({ }, adb: DBApi) => memberTypesResolver.memberType(profile.memberTypeId, adb),
    user: async ({ }, adb: DBApi) => usersResolver.user(profile.userId, adb)
});

export const profiles = async (adb: DBApi) =>
    (await adb.profiles.getAll()).map((e) => wrapProfile(e));

export const profile = async (profileId: string, adb: DBApi) => {
    const result = await adb.profiles.getById(profileId);
    if (!result) return new GraphQLError('profile not found');
    return wrapProfile(result);
}

export const profileByUserId = async (userId: string, adb: DBApi) => {
    const result = await adb.profiles.getByUserId(userId);
    if (!result) return new GraphQLError('profile not found');
    return wrapProfile(result);
}
