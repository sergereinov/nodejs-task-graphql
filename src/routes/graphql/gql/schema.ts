export const queriesSchema: string = `
type User {
  id: ID!
  firstName: String
  lastName: String
  email: String
  subscribedToUser: [User]
  userSubscribedTo: [User]
  posts: [Post]
  profile: Profile
  memberType: MemberType  
}

type Post {
  id: ID!
  title: String
  content: String
  user: User!
}

type Profile {
  id: ID!
  avatar: String
  sex: String
  birthday: Int
  country: String
  street: String
  city: String
  memberType: MemberType
  user: User
}

type MemberType {
  id: String
  discount: Int
  monthPostsLimit: Int
}

type Query {
  users: [User]
  user(id: ID!): User
  posts: [Post]
  post(id: ID!): Post
  profiles: [Profile]
  profile(id: ID!): Profile
  memberTypes: [MemberType]
  memberType(id: String): MemberType
}

input UserInput {
  firstName: String
  lastName: String
  email: String
}

input ProfileInput {
  avatar: String
  sex: String
  birthday: Int
  country: String
  street: String
  city: String
  memberTypeId: String
  userId: ID!
}

input ProfileUpdateInput {
  avatar: String
  sex: String
  birthday: Int
  country: String
  street: String
  city: String
  memberTypeId: String
}

input PostInput {
  title: String
  content: String
  userId: String
}

input PostUpdateInput {
  title: String
  content: String
}

input MemberTypeUpdateInput {
  discount: Int
  monthPostsLimit: Int
}


type Mutation {
  createStub(seed: String): [User]
  createUser(input: UserInput): User
  createProfile(input: ProfileInput): Profile
  createPost(input: PostInput): Post
  updateUser(userId: ID!, input: UserInput): User
  updateProfile(profileId: ID!, input: ProfileUpdateInput): Profile
  updatePost(postId: ID!, input: PostUpdateInput): Post
  updateMemberType(memberTypeId: String, input: MemberTypeUpdateInput): MemberType
}

schema {
  query: Query
  mutation: Mutation
}
`;
