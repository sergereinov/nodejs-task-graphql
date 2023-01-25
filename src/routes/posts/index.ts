import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { HttpError } from "@fastify/sensible/lib/httpError";
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { validatePatchBody } from "../../utils/validators";
import { validate } from "uuid";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<PostEntity[]> {
    return await fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity | HttpError> {
      const post = await fastify.db.posts.findOne({ key: "id", equals: request.params.id });

      return post ? post : fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request): Promise<PostEntity | HttpError> {
      const user = fastify.db.users.findOne({ key: "id", equals: request.body.userId })

      if (!user) {
        return fastify.httpErrors.badRequest();
      }

      return await fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity | HttpError> {
      if (!validate(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }

      const post = await fastify.db.posts.findOne({ key: "id", equals: request.params.id });

      if (post) {
        return await fastify.db.posts.delete(request.params.id);
      }

      return fastify.httpErrors.notFound();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<PostEntity | HttpError> {
      if (!validatePatchBody(request.body, ['title', 'content'])) {
        return fastify.httpErrors.badRequest();
      }

      const post = await fastify.db.posts.findOne({ key: "id", equals: request.params.id });

      if (post) {
        return await fastify.db.posts.change(request.params.id, request.body);
      }

      return fastify.httpErrors.notFound();
    }
  );
};

export default plugin;
