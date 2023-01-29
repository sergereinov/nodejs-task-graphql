import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { validate } from 'graphql';
import depthLimit = require('graphql-depth-limit');
import { graphql } from 'graphql/graphql';
import { parse } from 'graphql/language';
import { buildSchema } from 'graphql/utilities';
import { graphqlBodySchema } from './schema';

const schema = buildSchema(`
  type User {
    id: ID!
    firstName: String
    lastName: String
    email: String
    subscribedToUserIds: [User]
  } 

  type Query {
    users: [User]
    user(id: ID!): User
  }

  schema {
    query: Query
  }
`);

const root = {
  users: () => ([{ id: '1', firstName: 'a1' }]),
  user: ({ id }: { id: String }) => ({
    id: id,
    firstName: id + '-a13',
    subscribedToUserIds: () => {
      return [
        root.user({ id: id + '-4' }),
        root.user({ id: id + '-5' }),
      ]
    }
  }),
};

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
      console.log('body =', request.body);
      const query: string = request.body.query || '';

      const err = validate(schema, parse(query), [depthLimit(10)]);
      if (err.length > 0) {
        return err;
      }

      return await graphql({
        schema: schema,
        source: query,
        rootValue: root,
        variableValues: request.body.variables,
      });
    }
  );
};

export default plugin;
