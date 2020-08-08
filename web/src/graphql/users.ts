import { gql } from '@apollo/client';

export const usersQuery = gql`
  query AllUsers {
    users {
      id
      name
      email
      username
      role
    }
  }
`;

export const deleteUserMutation = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
