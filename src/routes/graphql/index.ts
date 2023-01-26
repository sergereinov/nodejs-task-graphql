import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema } from 'graphql';
import { graphqlBodySchema } from './schema';
import query from "./query/queryType";
import mutation from "./mutation/mutationType";

const schema = new GraphQLSchema({ query, mutation });

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      return await graphql({
        schema,
        source: request.body.query?.toString() || '',
        contextValue: fastify,
        variableValues: request.body.variables,
      });
    }
  );
};

export default plugin;
