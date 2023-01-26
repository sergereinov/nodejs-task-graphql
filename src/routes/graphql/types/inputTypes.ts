import { GraphQLID, GraphQLInputObjectType, GraphQLString } from "graphql";
import { memberTypeBodyType, postBodyType, profileBodyType, userBodyType } from "./common";

export const userCreateInputType = new GraphQLInputObjectType({
  name: "UserCreateInputType",
  fields: userBodyType,
});

export const profileCreateInputType = new GraphQLInputObjectType({
  name: "ProfileCreateInputType",
  fields: profileBodyType,
});

export const postCreateInputType = new GraphQLInputObjectType({
  name: "PostCreateInputType",
  fields: postBodyType,
});

export const userUpdateInputType = new GraphQLInputObjectType({
  name: "UserUpdateInputType",
  fields: {
    ...userBodyType,
    id: { type: GraphQLID },
  },
});

export const profileUpdateInputType = new GraphQLInputObjectType({
  name: "ProfileUpdateInputType",
  fields: {
    ...profileBodyType,
    id: { type: GraphQLID },
  },
});

export const postUpdateInputType = new GraphQLInputObjectType({
  name: "PostUpdateInputType",
  fields: {
    ...postBodyType,
    id: { type: GraphQLID },
  },
});

export const memberTypeUpdateInputType = new GraphQLInputObjectType({
  name: "MemberTypeUpdateInputType",
  fields: {
    ...memberTypeBodyType,
    id: { type: GraphQLString },
  },
});