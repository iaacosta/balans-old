import { gql } from '@apollo/client';

export const setupDatabaseMutation = gql`
  mutation SetupDatabase($user: CreateUserInput!) {
    setupDatabase(adminUser: $user) {
      id
    }
  }
`;
