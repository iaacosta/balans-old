import { gql } from '@apollo/client';

export const myTransactionsQuery = gql`
  query MyTransactions {
    transactions: myTransactions {
      id
      amount
      memo
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

export const updateTransactionMutation = gql`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      id
      amount
      memo
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

export const deleteTransactionMutation = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
