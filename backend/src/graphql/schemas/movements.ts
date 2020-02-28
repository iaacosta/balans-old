import { gql } from 'apollo-server-express';

export default gql`
  type Income {
    id: ID!
    amount: Float!
    description: String!
    date: Date!
    account: Account!
    subCategory: SubCategory!
    createdAt: Date!
    updatedAt: Date!
  }
`;
