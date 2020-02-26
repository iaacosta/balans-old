import { gql } from 'apollo-server-express';

export default gql`
  type Category {
    id: ID!
    name: String!
    type: String!
    icon: String!
    createdAt: Date!
    updatedAt: Date!
  }
`;
