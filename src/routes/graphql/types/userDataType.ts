import { GraphQLObjectType, GraphQLList } from "graphql";
import { memberType, postType, profileType, userBodyType, userRestDataType } from "./common";
import * as DataLoader from "dataloader";
import { BatchLoadFn } from "dataloader";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../../utils/DB/entities/DBPosts";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";

export const useDataLoader = <T>(id: string, dataLoaders: Map<string, DataLoader<string, T>>, key: string, batchLoader: BatchLoadFn<string, T>) => {
  let dataLoader = dataLoaders.get(key);

  if (!dataLoader) {
    dataLoader = new DataLoader(batchLoader);
    dataLoaders.set(key, dataLoader);
  }

  return dataLoader.load(id);
};

const userDataType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserDataType',
  fields: () => ({
    ...userRestDataType,
    ...userBodyType,
    profile: {
      type: profileType,
      resolve: async ({ id }, _, { fastify, dataLoaders }, { fieldName }) => {
        return useDataLoader(id, dataLoaders, fieldName, async (ids: readonly string[]) => {
          const profiles = await fastify.db.profiles.findMany({ key: "userId", equalsAnyOf: ids });

          return ids.map(value => profiles.find(({ userId }: ProfileEntity) => userId === value));
        });
      }
    },
    memberType: {
      type: memberType,
      resolve: async ({ id }, _, { fastify, dataLoaders }, { fieldName }) => {
        const memberTypesId = await useDataLoader(id, dataLoaders, `${fieldName}.profile`, async (ids: readonly string[]) => {
          const profiles = await fastify.db.profiles.findMany({ key: "userId", equalsAnyOf: ids });

          return ids.map(id => profiles.find(({ userId }: ProfileEntity) => userId === id)?.memberTypeId);
        });

        return memberTypesId ? await useDataLoader(memberTypesId, dataLoaders, fieldName, async (ids: readonly string[]) => {
          const memberTypes = await fastify.db.memberTypes.findMany({ key: "id", equalsAnyOf: ids });

          return ids.map(value => memberTypes.find((type: MemberTypeEntity) => type.id === value));
        }) : null;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async ({ id }, _, { fastify, dataLoaders }, { fieldName }) => {
        return await useDataLoader(id, dataLoaders, fieldName, async (ids: readonly string[]) => {
          const posts = await fastify.db.posts.findMany({ key: "userId", equalsAnyOf: ids });

          return ids.map(value => posts.filter(({ userId }: PostEntity) => userId === value));
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userDataType),
      resolve: async ({ id, subscribedToUserIds }, _, { fastify, dataLoaders }, info) => {
        const users = await useDataLoader("users", dataLoaders, "users", async () => {
          const { json } = await fastify.inject({ url: '/users', method: 'GET' });

          return [json()];
        });

        return users.filter(({ id }: UserEntity) => subscribedToUserIds.includes(id));
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userDataType),
      resolve: async ({ id }, _, { fastify, dataLoaders }, { fieldName }) => {
        return await useDataLoader(id, dataLoaders, fieldName, async (ids: readonly string[]) => {
          const users = await fastify.db.users.findMany({ key: "subscribedToUserIds", inArrayAnyOf: ids });

          return ids.map(value => users.filter(({ subscribedToUserIds }: UserEntity) => subscribedToUserIds.includes(value)));
        });
      }
    },
  }),
});

export default userDataType;