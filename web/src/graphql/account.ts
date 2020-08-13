import { gql } from '@apollo/client';

export const createDebitAccountMutation = gql`
  mutation CreateDebitAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      id
      name
      bank
      type
      balance
    }
  }
`;
