import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    getCurrencies: [Currency!]
    getCurrency(id: ID!): Currency!
  }

  type Mutation {
    createCurrency(name: String!): Currency!
    updateCurrency(id: ID!, name: String!): ID!
    deleteCurrency(id: ID!): ID!
  }
`;
