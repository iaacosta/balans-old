import { gql } from '@apollo/client';

export const myTransactionsQuery = gql`
  query MyTransactions {
    transactions: myTransactions {
      id
      amount
      resultantBalance
      account {
        id
        name
        bank
      }
      createdAt
    }
  }
`;

export const createTransactionMutation = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
    }
  }
`;
