import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { validate } from 'graphql';
import depthLimit = require('graphql-depth-limit');
import { graphql } from 'graphql/graphql';
import { parse } from 'graphql/language';
import { buildSchema } from 'graphql/utilities';
import { graphqlBodySchema } from './schema';
import { queriesSchema } from './gql/schema';
import { rootResolver } from './gql/resolvers';

const schema = buildSchema(queriesSchema);
const root = rootResolver;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const query: string = request.body.query || '';
      
      const err = validate(schema, parse(query), [depthLimit(4)]);
      if (err.length > 0) return err;

      return await graphql({
        schema: schema,
        source: query,
        rootValue: root,
        variableValues: request.body.variables,
        contextValue: fastify.adb
      });
    }
  );
};

export default plugin;
