import { gql } from '@apollo/client';

export const myPassivesQuery = gql`
  query MyPassives {
    passives: myPassives {
      id
      amount
      memo
      liquidated
      account {
        id
        name
        bank
      }
      liquidatedAccount {
        id
        name
        bank
      }
      issuedAt
    }
  }
`;

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
      liquidated
      liquidatedAccount {
        id
        name
        bank
      }
    }
  }
`;

export const deletePassiveMutation = gql`
  mutation DeletePassive($id: ID!) {
    deletePassive(id: $id)
  }
`;
