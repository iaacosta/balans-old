import { gql } from '@apollo/client';

export const usersQuery = gql`
  query AllUsers {
    users {
      id
      firstName
      lastName
      name
      email
      username
      role
    }
  }
`;

export const deletedUsersQuery = gql`
  query AllDeletedUsers {
    users: deletedUsers {
      id
      name
      email
      username
      role
    }
  }
`;

export const updateUserMutation = gql`
  mutation UpdateUser($input: UpdateAnyUserInput!) {
    updateUser(input: $input) {
      id
      firstName
      lastName
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

export const restoreUserMutation = gql`
  mutation RestoreUser($id: ID!) {
    restoreUser(id: $id) {
      id
    }
  }
`;
