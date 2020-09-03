import { gql } from '@apollo/client';

export const createTransferMutation = gql`
  mutation CreateTransfer($input: CreateTransferInput!) {
    createTransfer(input: $input) {
      id
      operationId
    }
  }
`;
