import { gql } from 'apollo-server-express';

export const creditAccount = {
  GET_CREDIT_ACCOUNTS: gql`
    query {
      getCreditAccounts {
        id
        name
        bank
        initialBalance
        billingDay
        paymentDay
        currency {
          id
          name
        }
      }
    }
  `,
  GET_CREDIT_ACCOUNT: gql`
    query($id: ID!) {
      getCreditAccount(id: $id) {
        id
        name
        bank
        initialBalance
        billingDay
        paymentDay
        currency {
          id
          name
        }
      }
    }
  `,
  CREATE_CREDIT_ACCOUNT: gql`
    mutation(
      $name: String!
      $bank: String!
      $initialBalance: Int!
      $currencyId: ID!
      $billingDay: Int!
      $paymentDay: Int!
    ) {
      createCreditAccount(
        name: $name
        bank: $bank
        initialBalance: $initialBalance
        currencyId: $currencyId
        billingDay: $billingDay
        paymentDay: $paymentDay
      ) {
        id
        name
        bank
        initialBalance
        billingDay
        paymentDay
        currency {
          id
          name
        }
      }
    }
  `,
  UPDATE_CREDIT_ACCOUNT: gql`
    mutation(
      $id: ID!
      $name: String
      $bank: String
      $initialBalance: Int
      $currencyId: ID
      $billingDay: Int
      $paymentDay: Int
    ) {
      updateCreditAccount(
        id: $id
        name: $name
        bank: $bank
        initialBalance: $initialBalance
        currencyId: $currencyId
        billingDay: $billingDay
        paymentDay: $paymentDay
      ) {
        id
        name
        bank
        initialBalance
        billingDay
        paymentDay
        currency {
          id
          name
        }
      }
    }
  `,
  DELETE_CREDIT_ACCOUNT: gql`
    mutation($id: ID!) {
      deleteCreditAccount(id: $id)
    }
  `,
};

export const debitAccount = {
  GET_DEBIT_ACCOUNTS: gql`
    query {
      getDebitAccounts {
        id
        name
        bank
        initialBalance
        allowsNegative
        currency {
          id
          name
        }
      }
    }
  `,
  GET_DEBIT_ACCOUNT: gql`
    query($id: ID!) {
      getDebitAccount(id: $id) {
        id
        name
        bank
        initialBalance
        allowsNegative
        currency {
          id
          name
        }
      }
    }
  `,
  CREATE_DEBIT_ACCOUNT: gql`
    mutation(
      $name: String!
      $bank: String!
      $initialBalance: Int!
      $allowsNegative: Boolean!
      $currencyId: ID!
    ) {
      createDebitAccount(
        name: $name
        bank: $bank
        initialBalance: $initialBalance
        allowsNegative: $allowsNegative
        currencyId: $currencyId
      ) {
        id
        name
        bank
        initialBalance
        allowsNegative
        currency {
          id
          name
        }
      }
    }
  `,
  UPDATE_DEBIT_ACCOUNT: gql`
    mutation(
      $id: ID!
      $name: String
      $bank: String
      $initialBalance: Int
      $currencyId: ID
    ) {
      updateDebitAccount(
        id: $id
        name: $name
        bank: $bank
        initialBalance: $initialBalance
        currencyId: $currencyId
      ) {
        id
        name
        bank
        initialBalance
        allowsNegative
        currency {
          id
          name
        }
      }
    }
  `,
  DELETE_DEBIT_ACCOUNT: gql`
    mutation($id: ID!) {
      deleteDebitAccount(id: $id)
    }
  `,
};

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

export const category = {
  GET_CATEGORIES: gql`
    query {
      getCategories {
        id
        name
        type
        icon
      }
    }
  `,
  GET_CATEGORY: gql`
    query($id: ID!) {
      getCategory(id: $id) {
        id
        name
        type
        icon
      }
    }
  `,
  CREATE_CATEGORY: gql`
    mutation($name: String!, $type: String!, $icon: String!) {
      createCategory(name: $name, type: $type, icon: $icon) {
        id
        name
        type
        icon
      }
    }
  `,
  UPDATE_CATEGORY: gql`
    mutation($id: ID!, $name: String, $type: String, $icon: String) {
      updateCategory(id: $id, name: $name, type: $type, icon: $icon) {
        id
        name
        type
        icon
      }
    }
  `,
  DELETE_CATEGORY: gql`
    mutation($id: ID!) {
      deleteCategory(id: $id)
    }
  `,
};

export const subCategory = {
  GET_SUBCATEGORIES: gql`
    query {
      getSubCategories {
        id
        name
        category {
          id
          name
          type
          icon
        }
      }
    }
  `,
  GET_SUBCATEGORY: gql`
    query($id: ID!) {
      getSubCategory(id: $id) {
        id
        name
        category {
          id
          name
          type
          icon
        }
      }
    }
  `,
  CREATE_SUBCATEGORY: gql`
    mutation($name: String!, $categoryId: ID!) {
      createSubCategory(name: $name, categoryId: $categoryId) {
        id
        name
        category {
          id
          name
          type
          icon
        }
      }
    }
  `,
  UPDATE_SUBCATEGORY: gql`
    mutation($id: ID!, $name: String, $categoryId: ID) {
      updateSubCategory(id: $id, name: $name, categoryId: $categoryId) {
        id
        name
        category {
          id
          name
          type
          icon
        }
      }
    }
  `,
  DELETE_SUBCATEGORY: gql`
    mutation($id: ID!) {
      deleteSubCategory(id: $id)
    }
  `,
  GET_SUBCATEGORY_NESTED: gql`
    query($id: ID!) {
      getSubCategory(id: $id) {
        id
        name
        category {
          id
          name
          type
          icon
          subCategories {
            id
            name
          }
        }
      }
    }
  `,
};
