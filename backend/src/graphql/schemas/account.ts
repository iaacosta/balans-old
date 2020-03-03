import { gql } from 'apollo-server-express';

export default gql`
  type Account {
    id: ID!
    type: String!
    name: String!
    bank: String!
    initialBalance: Int!
    currency: Currency!
    balance: Float!
    notBilled: Float!
    billingDay: Int
    paymentDay: Int
    incomes: [Income!]
    expenses: [Expense!]
    createdAt: Date!
    updatedAt: Date!
  }
`;
