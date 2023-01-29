import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import * as depthLimit from "graphql-depth-limit";
import { graphqlBodySchema } from './schema';
import query from "./query/queryType";
import mutation from "./mutation/mutationType";

const schema = new GraphQLSchema({ query, mutation });
const DEPTH_LIMIT_VALUE = 3;

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request) {
      const source = request.body.query?.toString() || '';
      const errors = validate(schema, parse(source), [depthLimit(DEPTH_LIMIT_VALUE)]);

      if (errors.length) {
        return { errors: `Error: exceeds maximum operation depth of ${DEPTH_LIMIT_VALUE}` };
      }

      return await graphql({
        schema,
        source,
        contextValue: fastify,
        variableValues: request.body.variables,
      });
    }
  );
};

export default plugin;
