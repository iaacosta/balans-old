import { gql } from 'apollo-server-express';

export const GET_CURRENCIES = gql`
  query {
    getCurrencies {
      id
      name
    }
  }
`;

export const GET_CURRENCY = gql`
  query($id: ID!) {
    getCurrency(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_CURRENCY = gql`
  mutation($name: String!) {
    createCurrency(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_CURRENCY = gql`
  mutation($id: ID!, $name: String!) {
    updateCurrency(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_CURRENCY = gql`
  mutation($id: ID!) {
    deleteCurrency(id: $id)
  }
`;
