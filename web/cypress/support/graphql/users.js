import { gql } from '@apollo/client';

export const meQuery = gql`
  query Me {
    me {
      id
      name
      username
      email
      role
    }
  }
`;

export const loginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

export const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export const deleteUserMutation = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
