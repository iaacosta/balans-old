import { gql } from '@apollo/client';

export const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    token: login(input: { username: $username, password: $password })
  }
`;

export const signUpMutation = gql`
  mutation SignUp($input: CreateUserInput!) {
    token: signUp(input: $input)
  }
`;
