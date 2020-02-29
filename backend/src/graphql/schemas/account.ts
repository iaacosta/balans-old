import { gql } from 'apollo-server-express';

export default gql`
  type Account {
    id: ID!
    type: String!
    name: String!
    bank: String!
    initialBalance: Int!
    currency: Currency!
    billingDay: Int
    paymentDay: Int
    incomes: [Income!]
    createdAt: Date!
    updatedAt: Date!
  }
`;
