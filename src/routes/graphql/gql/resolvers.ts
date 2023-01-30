import { DBApi } from '../../../utils/DB/DBApi';
import { ChangeUserDTO, CreateUserDTO } from '../../../utils/DB/entities/DBUsers';
import { ChangePostDTO, CreatePostDTO } from '../../../utils/DB/entities/DBPosts';
import { ChangeProfileDTO, CreateProfileDTO } from "../../../utils/DB/entities/DBProfiles";
import { ChangeMemberTypeDTO } from '../../../utils/DB/entities/DBMemberTypes';
import * as stubResolver from './stub';
import * as usersResolver from './users';
import * as postsResolver from './posts';
import * as profilesResolver from './profiles';
import * as memberTypesResolver from './member-types';

export const rootResolver = {
    // This helper creates data stub
    createStub: async ({ seed }: { seed: string }, adb: DBApi) => stubResolver.createStub(seed, adb),

    // Users resolvers
    users: async ({ }, adb: DBApi) => usersResolver.users(adb),
    user: async ({ id }: { id: string }, adb: DBApi) => usersResolver.user(id, adb),
    createUser: async ({ input }: { input: CreateUserDTO }, adb: DBApi) =>
        usersResolver.createUser(input, adb),
    updateUser: async (
        { userId, input }: { userId: string, input: ChangeUserDTO },
        adb: DBApi
    ) => usersResolver.updateUser(userId, input, adb),
    subscribeTo: async (
        { userId, subscribesToUserId }: { userId: string, subscribesToUserId: string },
        adb: DBApi
    ) => usersResolver.subscribeTo(userId, subscribesToUserId, adb),
    unsubscribeFrom: async (
        { userId, unsubscribesFromUserId }: { userId: string, unsubscribesFromUserId: string },
        adb: DBApi
    ) => usersResolver.unsubscribeFrom(userId, unsubscribesFromUserId, adb),

    // Posts resolvers
    posts: async ({ }, adb: DBApi) => postsResolver.posts(adb),
    post: async ({ id }: { id: string }, adb: DBApi) => postsResolver.post(id, adb),
    createPost: async ({ input }: { input: CreatePostDTO }, adb: DBApi) =>
        postsResolver.createPost(input, adb),
    updatePost: async (
        { postId, input }: { postId: string, input: ChangePostDTO },
        adb: DBApi
    ) => postsResolver.updatePort(postId, input, adb),

    // Profiles resolvers
    profiles: async ({ }, adb: DBApi) => profilesResolver.profiles(adb),
    profile: async ({ id }: { id: string }, adb: DBApi) => profilesResolver.profile(id, adb),
    createProfile: async ({ input }: { input: CreateProfileDTO }, adb: DBApi) =>
        profilesResolver.createProfile(input, adb),
    updateProfile: async (
        { profileId, input }: { profileId: string, input: ChangeProfileDTO },
        adb: DBApi
    ) => profilesResolver.updateProfile(profileId, input, adb),

    // Member types resolvers
    memberTypes: async ({ }, adb: DBApi) => memberTypesResolver.memberTypes(adb),
    memberType: async ({ id }: { id: string }, adb: DBApi) =>
        memberTypesResolver.memberType(id, adb),
    updateMemberType: async (
        { memberTypeId, input }: { memberTypeId: string, input: ChangeMemberTypeDTO },
        adb: DBApi
    ) => memberTypesResolver.updateMemberType(memberTypeId, input, adb),
};
