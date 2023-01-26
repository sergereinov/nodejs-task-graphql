import { GraphQLID, GraphQLObjectType } from "graphql";
import { memberType, postType, profileType, userType } from "../types/common";
import { FastifyInstance } from "fastify";
import {
  memberTypeUpdateInputType,
  postCreateInputType, postUpdateInputType,
  profileCreateInputType,
  profileUpdateInputType,
  userCreateInputType, userUpdateInputType
} from "../types/inputTypes";

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userType,
      args: {
        payload: {
          type: userCreateInputType,
        },
      },
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: '/users', method: 'POST', payload });

        return json();
      },
    },
    createProfile: {
      type: profileType,
      args: {
        payload: {
          type: profileCreateInputType,
        },
      } ,
      //@todo: handle error if profile already exists
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: '/profiles', method: 'POST', payload });

        return json();
      },
    },
    createPost: {
      type: postType,
      args: {
        payload: {
          type: postCreateInputType,
        },
      },
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: '/posts', method: 'POST', payload });

        return json();
      },
    },

    updateUser: {
      type: userType,
      args: {
        payload: {
          type: userUpdateInputType,
        },
      },
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/users/${payload.id}`, method: 'PATCH', payload });

        return json();
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        payload: {
          type: profileUpdateInputType,
        },
      },
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/profiles/${payload.id}`, method: 'PATCH', payload });

        return json();
      },
    },
    updatePost: {
      type: postType,
      args: {
        payload: {
          type: postUpdateInputType,
        },
      },
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/posts/${payload.id}`, method: 'PATCH', payload });

        return json();
      },
    },
    updateMemberType: {
      type: memberType,
      args: {
        payload: {
          type: memberTypeUpdateInputType,
        },
      },
      resolve: async (_, { payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/member-types/${payload.id}`, method: 'PATCH', payload });

        return json();
      },
    },

    userSubscribeTo: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (_, { id, ...payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/users/${id}/subscribeTo`, method: 'POST', payload });

        return json();
      },
    },
    userUnsubscribeFrom: {
      type: userType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve: async (_, { id, ...payload }, app: FastifyInstance) => {
        const { json } = await app.inject({ url: `/users/${id}/unsubscribeFrom`, method: 'POST', payload });

        return json();
      },
    },
  },
});