import { gql } from '@apollo/client';

export const myAccountsQuery = gql`
  query MyAccounts {
    accounts: myAccounts {
      id
      name
      bank
      type
      balance
    }
  }
`;

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

export const deleteDebitAccountMutation = gql`
  mutation DeleteDebitAccount($id: ID!) {
    deleteAccount(id: $id)
  }
`;
