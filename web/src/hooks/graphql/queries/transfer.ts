import { gql } from '@apollo/client';

export const myTransfersQuery = gql`
  query MyTransfers {
    transfers: myPairedTransfers {
      from {
        id
        amount
        memo
        operationId
        account {
          id
          name
        }
        issuedAt
      }
      to {
        id
        amount
        memo
        operationId
        account {
          id
          name
        }
        issuedAt
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

export const deleteTransferMutation = gql`
  mutation DeleteTransfer($operationId: String!) {
    deleteTransfer(operationId: $operationId)
  }
`;
