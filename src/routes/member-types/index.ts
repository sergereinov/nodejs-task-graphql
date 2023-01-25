import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { HttpError } from "@fastify/sensible/lib/httpError";
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { validatePatchBody } from "../../utils/validators";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<MemberTypeEntity[]> {
    return await fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity | HttpError> {
      const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: request.params.id });

      return memberType ? memberType : fastify.httpErrors.notFound();
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity | HttpError> {
      if (!validatePatchBody(request.body, ['discount', 'monthPostsLimit'])) {
        return fastify.httpErrors.badRequest();
      }

      const memberType = await fastify.db.memberTypes.findOne({ key: "id", equals: request.params.id });

      if (memberType) {
        return await fastify.db.memberTypes.change(request.params.id, request.body);
      }

      return fastify.httpErrors.notFound();
    }
  );
};

export default plugin;
