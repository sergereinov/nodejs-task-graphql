import { GraphQLObjectType, GraphQLList } from "graphql";
import { FastifyInstance } from "fastify";
import { memberType, postType, profileType, userBodyType, userRestDataType } from "./common";

const userDataType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserDataType',
  fields: () => ({
    ...userRestDataType,
    ...userBodyType,
    profile: {
      type: profileType,
      resolve: async ({ id }, _, app: FastifyInstance) =>
        await app.db.profiles.findOne({ key: "userId", equals: id }),
    },
    memberType: {
      type: memberType,
      resolve: async ({ id }, _, app: FastifyInstance) => {
        const { memberTypeId } = await app.db.profiles.findOne({ key: "userId", equals: id }) || {};

        return memberTypeId ? await app.db.memberTypes.findOne({ key: "id", equals: memberTypeId }) : null;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async ({ id }, _, app: FastifyInstance) => await app.db.posts.findMany({ key: "userId", equals: id }),
    },
    subscribedToUser: {
      type: new GraphQLList(userDataType),
      resolve: async ({ id, subscribedToUserIds }, _, app: FastifyInstance) =>
        await app.db.users.findMany({ key: "id", equalsAnyOf: subscribedToUserIds }),
    },
    userSubscribedTo: {
      type: new GraphQLList(userDataType),
      resolve: async ({ id }, _, app: FastifyInstance) =>
        await app.db.users.findMany({ key: "subscribedToUserIds", inArray: id }),
    },
  }),
});

export default userDataType;