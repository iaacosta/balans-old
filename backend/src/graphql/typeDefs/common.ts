import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    getCurrencies: [Currency!]
    getCurrency(id: ID!): Currency!
  }
`;
