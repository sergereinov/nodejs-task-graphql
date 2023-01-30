import { DBApi } from '../../../utils/DB/DBApi';
import { CreateUserDTO, UserEntity } from '../../../utils/DB/entities/DBUsers';
import { GraphQLError } from 'graphql/error';
import { CreatePostDTO, PostEntity } from '../../../utils/DB/entities/DBPosts';

const wrapUser = (user: UserEntity) => ({
    ...user,
    subscribedToUser: async ({ }, adb: DBApi) =>
        user.subscribedToUserIds.map(async (userId) => await adb.users.getById(userId)),
    posts: async ({ }, adb: DBApi) =>
        (await adb.posts.getByUserId(user.id)).map((e) => wrapPost(e))
});

const wrapPost = (post: PostEntity) => ({
    ...post,
    user: async ({ }, adb: DBApi) => resolveUser(post.userId, adb)
});

const resolveUsers = async (adb: DBApi) =>
    (await adb.users.getAll()).map((u) => wrapUser(u));

const resolveUser = async (userId: string, adb: DBApi) => {
    const u = await adb.users.getById(userId);
    if (!u) return new GraphQLError('user not found');
    return wrapUser(u);
}

const resolvePosts = async (adb: DBApi) =>
    (await adb.posts.getAll()).map((e) => wrapPost(e));

const resolvePost = async (postId: string, adb: DBApi) => {
    const post = await adb.posts.getById(postId);
    if (!post) return new GraphQLError('post not found');
    return wrapPost(post);
}

export const rootResolver = {
    users: async ({ }, adb: DBApi) => resolveUsers(adb),
    user: async ({ id }: { id: string }, adb: DBApi) => resolveUser(id, adb),
    createUser: async ({ input }: { input: CreateUserDTO }, adb: DBApi) =>
        wrapUser(await adb.users.create(input)),

    posts: async ({ }, adb: DBApi) => resolvePosts(adb),
    post: async ({ id }: { id: string }, adb: DBApi) => resolvePost(id, adb),
    createPost: async ({ input }: { input: CreatePostDTO }, adb: DBApi) =>
        wrapPost(await adb.posts.create(input))
};
