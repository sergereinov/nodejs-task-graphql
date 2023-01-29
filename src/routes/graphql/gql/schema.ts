export const queriesSchema: string = `
type User {
  id: ID!
  firstName: String
  lastName: String
  email: String
  subscribedToUser: [User]
} 

type Query {
  users: [User]
  user(id: ID!): User
}

input UserInput {
  firstName: String
  lastName: String
  email: String
}

type Mutation {
  createUser(input: UserInput): User
}

schema {
  query: Query
  mutation: Mutation
}
`;
