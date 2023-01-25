import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { HttpError } from "@fastify/sensible/lib/httpError";
import { validate } from "uuid";
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { validatePatchBody } from "../../utils/validators";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity | HttpError> {
      const profile = await fastify.db.profiles.findOne({ key: "id", equals: request.params.id });

      return profile ? profile : fastify.httpErrors.notFound();
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request): Promise<ProfileEntity | HttpError> {
      const getProfile = fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });
      const getMemberType = fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });
      const getUser = fastify.db.users.findOne({ key: 'id', equals: request.body.userId });
      const [profile, memberType, user] = await Promise.all([getProfile, getMemberType, getUser]);

      if (profile || !memberType || !user) {
        return fastify.httpErrors.badRequest();
      }

      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity | HttpError> {
      if (!validate(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }

      const profile = await fastify.db.profiles.findOne({ key: "id", equals: request.params.id });

      if (profile) {
        return await fastify.db.profiles.delete(request.params.id);
      }

      return fastify.httpErrors.notFound();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity | HttpError> {
      if (!validate(request.params.id)) {
        return fastify.httpErrors.badRequest();
      }

      const props = ['avatar', 'sex', 'birthday', 'country', 'street', 'city', 'memberTypeId'];

      if (!validatePatchBody(request.body, props)) {
        return fastify.httpErrors.badRequest();
      }

      const profile = await fastify.db.profiles.findOne({ key: "id", equals: request.params.id });

      if (profile) {
        return await fastify.db.profiles.change(request.params.id, request.body);
      }

      return fastify.httpErrors.notFound();
    }
  );
};

export default plugin;
