import { gql } from '@apollo/client';

export const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password })
  }
`;
