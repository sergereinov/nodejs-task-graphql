import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt } from "graphql";

export const userBodyType = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  email: { type: GraphQLString },
};

export const userRestDataType = {
  id: { type: GraphQLID },
  subscribedToUserIds: { type: new GraphQLList(GraphQLID) },
};

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    ...userRestDataType,
    ...userBodyType,
  },
});

export const profileBodyType = {
  avatar: { type: GraphQLString },
  sex: { type: GraphQLString },
  birthday: { type: GraphQLInt },
  country: { type: GraphQLString },
  street: { type: GraphQLString },
  city: { type: GraphQLString },
  memberTypeId: { type: GraphQLString },
  userId: { type: GraphQLID },
};

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: GraphQLID },
    ...profileBodyType,
  },
});

export const postBodyType = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  userId: { type: GraphQLID },
};

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
    ...postBodyType,
  },
});

export const memberTypeBodyType = {
  discount: { type: GraphQLInt },
  monthPostsLimit: { type: GraphQLInt },
};

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: GraphQLString },
    ...memberTypeBodyType,
  },
});

