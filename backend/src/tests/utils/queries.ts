import { gql } from 'apollo-server-express';

export const debitAccount = {};

export const currency = {
  GET_CURRENCIES: gql`
    query {
      getCurrencies {
        id
        name
      }
    }
  `,
  GET_CURRENCY: gql`
    query($id: ID!) {
      getCurrency(id: $id) {
        id
        name
      }
    }
  `,
  CREATE_CURRENCY: gql`
    mutation($name: String!) {
      createCurrency(name: $name) {
        id
        name
      }
    }
  `,
  UPDATE_CURRENCY: gql`
    mutation($id: ID!, $name: String!) {
      updateCurrency(id: $id, name: $name) {
        id
        name
      }
    }
  `,
  DELETE_CURRENCY: gql`
    mutation($id: ID!) {
      deleteCurrency(id: $id)
    }
  `,
};
