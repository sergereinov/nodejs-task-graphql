import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import DB from '../../utils/DB/DB';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });
      if (!user) throw reply.notFound();
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      try {
        //delete following
        const deleteFollowingById = async (db: DB, followerId: string) => {
          const following = await db.users.findMany({ key: 'subscribedToUserIds', inArray: followerId });
          following.forEach((e) => {
            const idx = e.subscribedToUserIds.findIndex((id) => id === followerId);
            if (idx >= 0) e.subscribedToUserIds.splice(idx, 1);
            db.users.change(e.id, e);
          });
        }

        await deleteFollowingById(fastify.db, request.params.id);

        //delete posts
        const deletePostsByUserId = async (db: DB, userId: string) => {
          const posts = await db.posts.findMany({ key: 'userId', equals: userId });
          posts.forEach((e) => {
            db.posts.delete(e.id);
          })
        };

        await deletePostsByUserId(fastify.db, request.params.id);

        //delete profile
        const deleteProfileByUserId = async (db: DB, userId: string) => {
          const profiles = await db.profiles.findMany({ key: 'userId', equals: userId });
          profiles.forEach((e) => {
            db.profiles.delete(e.id);
          })
        }

        await deleteProfileByUserId(fastify.db, request.params.id);

        return await fastify.db.users.delete(request.params.id);
      } catch (e) {
        throw reply.badRequest();
      }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      if (!user) throw reply.badRequest();
      const idx = user.subscribedToUserIds.findIndex((id) => id === request.params.id);
      if (idx < 0) user.subscribedToUserIds.push(request.params.id);
      return fastify.db.users.change(request.body.userId, user);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      if (!user) throw reply.badRequest();
      const idx = user.subscribedToUserIds.findIndex((id) => id === request.params.id);
      if (idx < 0) throw reply.badRequest();
      user.subscribedToUserIds.splice(idx, 1);
      return fastify.db.users.change(request.body.userId, user);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users
        .change(request.params.id, request.body)
        .catch(() => { throw reply.badRequest() });
    }
  );
};

export default plugin;
