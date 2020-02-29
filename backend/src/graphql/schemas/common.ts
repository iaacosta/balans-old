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
    getAccounts: [Account!]
    getAccount(id: ID!): Account!

    """
    Category
    """
    getCategories: [Category!]
    getCategory(id: ID!): Category!

    """
    Sub category
    """
    getSubCategories: [SubCategory!]
    getSubCategory(id: ID!): SubCategory!

    """
    Places
    """
    getPlaces: [Place!]
    getPlace(id: ID!): Place!

    """
    Incomes
    """
    getIncomes: [Income!]
    getIncome(id: ID!): Income!
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
    createAccount(
      type: String!
      name: String!
      bank: String!
      initialBalance: Int!
      paymentDay: Int
      billingDay: Int
      currencyId: ID!
    ): Account!

    updateAccount(
      id: ID!
      name: String
      bank: String
      initialBalance: Int
      paymentDay: Int
      billingDay: Int
      currencyId: ID
    ): Account!

    deleteAccount(id: ID!): ID!

    """
    Category
    """
    createCategory(name: String!, type: String!, icon: String!): Category!
    updateCategory(id: ID!, name: String, type: String, icon: String): Category!
    deleteCategory(id: ID!): ID!

    """
    Sub category
    """
    createSubCategory(name: String!, categoryId: ID!): SubCategory!
    updateSubCategory(id: ID!, name: String, categoryId: ID): SubCategory!
    deleteSubCategory(id: ID!): ID!

    """
    Place
    """
    createPlace(
      name: String!
      photo: Upload!
      latitude: Float!
      longitude: Float!
    ): Place!

    updatePlace(
      id: ID!
      name: String
      photo: Upload
      latitude: Float
      longitude: Float
    ): Place!

    deletePlace(id: ID!): ID!

    """
    Incomes
    """
    createIncome(
      amount: Float!
      description: String
      date: Date!
      accountId: ID!
      subCategoryId: ID!
    ): Income!

    updateIncome(
      id: ID!
      amount: Float
      description: String
      date: Date
      accountId: ID
      subCategoryId: ID
    ): Income!

    deleteIncome(id: ID!): ID!
  }
`;
