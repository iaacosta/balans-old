import { gql } from '@apollo/client';

export const createPassiveMutation = gql`
  mutation CreatePassive($input: CreatePassiveInput!) {
    createPassive(input: $input) {
      id
    }
  }
`;
