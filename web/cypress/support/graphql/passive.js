import { gql } from '@apollo/client';

export const createPassiveMutation = gql`
  mutation CreatePassive($input: CreatePassiveInput!) {
    createPassive(input: $input) {
      id
    }
  }
`;

export const liquidatePassiveMutation = gql`
  mutation LiquidatePassive($input: LiquidatePassiveInput!) {
    liquidatePassive(input: $input) {
      id
    }
  }
`;
