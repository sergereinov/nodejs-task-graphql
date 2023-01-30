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

input PostInput {
  title: String
  content: String
  userId: String
}

type Mutation {
  createStub(seed: String): [User]
  createUser(input: UserInput): User
  createPost(input: PostInput): Post
}

schema {
  query: Query
  mutation: Mutation
}
`;
