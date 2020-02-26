import { gql } from 'apollo-server-express';

export default gql`
  type Currency {
    id: ID!
    name: String!
    debitAccounts: [DebitAccount!]
    creditAccounts: [CreditAccount!]
    createdAt: Date!
    updatedAt: Date!
  }
`;
