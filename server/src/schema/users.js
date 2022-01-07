import { gql } from "apollo-server-express";

const userSchema = gql`
  type User {
    id: ID!
    nickname: String!
  }

  extend type Query {
    users: [User!]! # getUsers
    user(id: ID!): User! # getUser
  }
`;

export default userSchema;
