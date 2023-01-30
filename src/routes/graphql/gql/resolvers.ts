import { DBApi } from '../../../utils/DB/DBApi';
import { CreateUserDTO } from '../../../utils/DB/entities/DBUsers';
import { CreatePostDTO } from '../../../utils/DB/entities/DBPosts';
import { CreateProfileDTO } from "../../../utils/DB/entities/DBProfiles";
import * as stubResolver from './stub';
import * as usersResolver from './users';
import * as postsResolver from './posts';
import * as profilesResolver from './profiles';
import * as memberTypesResolver from './member-types';

export const rootResolver = {
    createStub: async ({ seed }: { seed: string }, adb: DBApi) => stubResolver.createStub(seed, adb),

    users: async ({ }, adb: DBApi) => usersResolver.users(adb),
    user: async ({ id }: { id: string }, adb: DBApi) => usersResolver.user(id, adb),
    createUser: async ({ input }: { input: CreateUserDTO }, adb: DBApi) => usersResolver.createUser(input, adb),

    posts: async ({ }, adb: DBApi) => postsResolver.posts(adb),
    post: async ({ id }: { id: string }, adb: DBApi) => postsResolver.post(id, adb),
    createPost: async ({ input }: { input: CreatePostDTO }, adb: DBApi) => postsResolver.createPost(input, adb),

    profiles: async ({ }, adb: DBApi) => profilesResolver.profiles(adb),
    profile: async ({ id }: { id: string }, adb: DBApi) => profilesResolver.profile(id, adb),
    createProfile: async ({ input }: { input: CreateProfileDTO }, adb: DBApi) => profilesResolver.createProfile(input, adb),

    memberTypes: async ({ }, adb: DBApi) => memberTypesResolver.memberTypes(adb),
    memberType: async ({ id }: { id: string }, adb: DBApi) => memberTypesResolver.memberType(id, adb),
};
