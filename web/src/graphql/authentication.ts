import { gql } from '@apollo/client';

export const loginMutation = gql`
  mutation Login($input: LoginInput!) {
    token: login(input: $input)
  }
`;

export const signUpMutation = gql`
  mutation SignUp($input: CreateUserInput!) {
    token: signUp(input: $input)
  }
`;

export const meQuery = gql`
  query Me {
    user: me {
      id
      name
      username
      role
    }
  }
`;
