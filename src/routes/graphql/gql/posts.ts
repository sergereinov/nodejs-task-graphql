import { GraphQLError } from 'graphql/error';
import { DBApi } from '../../../utils/DB/DBApi';
import { PostEntity, CreatePostDTO, ChangePostDTO } from '../../../utils/DB/entities/DBPosts';
import * as usersResolver from './users';

/**
 * Posts resolvers and wrappers
 */

/**
 * Wrap post object to match GraphQL schema `type Post`
 */
export const wrapPost = (post: PostEntity) => ({
    ...post,
    user: async ({ }, adb: DBApi) => usersResolver.user(post.userId, adb)
});

export const posts = async (adb: DBApi) =>
    (await adb.posts.getAll()).map((e) => wrapPost(e));

export const postsByUserId = async (userId: string, adb: DBApi) =>
    (await adb.posts.getByUserId(userId)).map((e) => wrapPost(e))

export const post = async (postId: string, adb: DBApi) => {
    const post = await adb.posts.getById(postId);
    if (!post) return new GraphQLError('post not found');
    return wrapPost(post);
}

export const createPost = async (dto: CreatePostDTO, adb: DBApi) =>
    wrapPost(await adb.posts.create(dto));

export const updatePort = async (postId: string, dto: ChangePostDTO, adb: DBApi) =>
    wrapPost(await adb.posts.update(postId, dto));
