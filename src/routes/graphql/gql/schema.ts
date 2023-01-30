export const queriesSchema: string = `
type User {
  id: ID!
  firstName: String
  lastName: String
  email: String
  subscribedToUser: [User]
  posts: [Post]
}

type Post {
  id: ID!
  title: String
  content: String
  user: User!
}

type Query {
  users: [User]
  user(id: ID!): User
  posts: [Post]
  post(id: ID!): Post
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
  createUser(input: UserInput): User
  createPost(input: PostInput): Post
}

schema {
  query: Query
  mutation: Mutation
}
`;
