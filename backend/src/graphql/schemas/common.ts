import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    """
    Currency
    """
    getCurrencies: [Currency!]
    getCurrency(id: ID!): Currency!

    """
    Accounts
    """
    getDebitAccounts: [DebitAccount!]
    getDebitAccount(id: ID!): DebitAccount!
  }

  type Mutation {
    """
    Currency
    """
    createCurrency(name: String!): Currency!
    updateCurrency(id: ID!, name: String!): ID!
    deleteCurrency(id: ID!): ID!

    """
    Accounts
    """
    createDebitAccount(
      name: String!
      bank: String!
      initialBalance: Int!
      allowsNegative: Boolean!
      currencyId: ID!
    ): DebitAccount!

    updateDebitAccount(
      id: ID!
      name: String
      bank: String
      initialBalance: Int
      currencyId: ID
    ): DebitAccount!

    deleteDebitAccount(id: ID!): ID!
  }
`;
