import { GraphQLString, GraphQLObjectType, GraphQLList, GraphQLID } from "graphql";
import { memberType, postType, profileType } from "../types/common";
import userDataType from "../types/userDataType";
import { FastifyInstance } from "fastify";

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    profiles: {
      type: new GraphQLList(profileType),
       resolve: async (_, __, app: FastifyInstance) => {
         const { json } = await app.inject({ url: '/profiles', method: 'GET' });

         return json();
      },
    },
    posts: {
      type: new GraphQLList(postType),
       resolve: async (_, __, app: FastifyInstance) => {
         const { json } = await app.inject({ url: '/posts', method: 'GET' });

         return json();
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
       resolve: async (_, __, app: FastifyInstance) => {
         const { json } = await app.inject({ url: '/member-types', method: 'GET' });

         return json();
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: async (_, { id }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/profiles/${id}`, method: 'GET' });

        return json();
      }
    },
    post: {
      type: postType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: async (_, { id }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/posts/${id}`, method: 'GET' });

        return json();
      }
    },
    memberType: {
      type: memberType,
      args: {
        id: { type: GraphQLString }
      },
      resolve: async (_, { id }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/member-types/${id}`, method: 'GET' });

        return json();
      }
    },
    user: {
      type: userDataType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (_, { id }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/users/${id}`, method: 'GET' });

        return json();
      }
    },
    users: {
      type: new GraphQLList(userDataType),
      resolve: async (_, { id }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: '/users', method: 'GET' });

        return json();
      }
    },
  },
});