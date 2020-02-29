import { gql } from 'apollo-server-express';

export default gql`
  type Category {
    id: ID!
    name: String!
    type: String!
    icon: String!
    subCategories: [SubCategory!]
    createdAt: Date!
    updatedAt: Date!
  }

  type SubCategory {
    id: ID!
    name: String!
    category: Category!
    incomes: [Income!]
    expenses: [Expense!]
    createdAt: Date!
    updatedAt: Date!
  }
`;
