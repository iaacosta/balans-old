import { gql } from '@apollo/client';

export const myTransfersQuery = gql`
  query MyTransfers {
    transfers: myPairedTransfers {
      from {
        id
        amount
        memo
        account {
          id
          name
        }
        createdAt
      }
      to {
        id
        amount
        memo
        account {
          id
          name
        }
        createdAt
      }
    }
  }
`;

export const createTransferMutation = gql`
  mutation CreateTransfer($input: CreateTransferInput!) {
    createTransfer(input: $input) {
      id
    }
  }
`;
