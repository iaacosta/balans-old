import { gql } from 'apollo-server-express';

export default gql`
  scalar Date

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
    getCreditAccounts: [CreditAccount!]
    getCreditAccount(id: ID!): CreditAccount!

    """
    Category
    """
    getCategories: [Category!]
    getCategory(id: ID!): Category!
  }

  type Mutation {
    """
    Currency
    """
    createCurrency(name: String!): Currency!
    updateCurrency(id: ID!, name: String!): Currency!
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

    createCreditAccount(
      name: String!
      bank: String!
      initialBalance: Int!
      currencyId: ID!
      billingDay: Int!
      paymentDay: Int!
    ): CreditAccount!

    updateCreditAccount(
      id: ID!
      name: String
      bank: String
      initialBalance: Int
      currencyId: ID
      billingDay: Int
      paymentDay: Int
    ): CreditAccount!

    deleteCreditAccount(id: ID!): ID!

    """
    Category
    """
    createCategory(name: String!, type: String!, icon: String!): Category!
    updateCategory(id: ID!, name: String, type: String, icon: String): Category!
    deleteCategory(id: ID!): ID!
  }
`;
