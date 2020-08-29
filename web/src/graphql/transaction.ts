import { gql } from '@apollo/client';

export const myTransactionsQuery = gql`
  query MyTransactions {
    transactions: myTransactions {
      id
      amount
      memo
      account {
        id
        name
        bank
        balance
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
      account {
        id
        name
        bank
        balance
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
