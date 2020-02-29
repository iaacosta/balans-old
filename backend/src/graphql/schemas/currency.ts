import { gql } from 'apollo-server-express';

export default gql`
  type Currency {
    id: ID!
    name: String!
    accounts: [Account!]
    createdAt: Date!
    updatedAt: Date!
  }
`;
