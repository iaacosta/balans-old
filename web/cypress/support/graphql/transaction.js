import { gql } from '@apollo/client';

export const createTransactionMutation = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`;
