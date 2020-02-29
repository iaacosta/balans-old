import { gql } from 'apollo-server-express';

export const account = {
  GET_ACCOUNTS: gql`
    query {
      getAccounts {
        id
        type
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
  GET_ACCOUNT: gql`
    query($id: ID!) {
      getAccount(id: $id) {
        id
        type
        name
        bank
        initialBalance
        billingDay
        paymentDay
        currency {
          id
          name
        }
        incomes {
          id
          amount
          date
          description
        }
      }
    }
  `,
  GET_ACCOUNT_AND_MOVEMENTS: gql`
    query($id: ID!) {
      getAccount(id: $id) {
        id
        type
        name
        bank
        initialBalance
        billingDay
        paymentDay
        currency {
          id
          name
        }
        incomes {
          id
          amount
          date
          description
        }
      }
    }
  `,
  CREATE_ACCOUNT: gql`
    mutation(
      $type: String!
      $name: String!
      $bank: String!
      $initialBalance: Int!
      $currencyId: ID!
      $billingDay: Int
      $paymentDay: Int
    ) {
      createAccount(
        type: $type
        name: $name
        bank: $bank
        initialBalance: $initialBalance
        currencyId: $currencyId
        billingDay: $billingDay
        paymentDay: $paymentDay
      ) {
        id
        type
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
  UPDATE_ACCOUNT: gql`
    mutation(
      $id: ID!
      $name: String
      $bank: String
      $initialBalance: Int
      $currencyId: ID
      $billingDay: Int
      $paymentDay: Int
    ) {
      updateAccount(
        id: $id
        name: $name
        bank: $bank
        initialBalance: $initialBalance
        currencyId: $currencyId
        billingDay: $billingDay
        paymentDay: $paymentDay
      ) {
        id
        type
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
  DELETE_ACCOUNT: gql`
    mutation($id: ID!) {
      deleteAccount(id: $id)
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
  GET_CURRENCY_AND_ACCOUNTS: gql`
    query($id: ID!) {
      getCurrency(id: $id) {
        id
        name
        accounts {
          id
          type
          name
          bank
          initialBalance
          billingDay
          paymentDay
        }
      }
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
        subCategories {
          id
          name
        }
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
        incomes {
          id
          amount
          date
          description
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

export const place = {
  GET_PLACES: gql`
    query {
      getPlaces {
        id
        name
        photoUri
        latitude
        longitude
      }
    }
  `,
  GET_PLACE: gql`
    query($id: ID!) {
      getPlace(id: $id) {
        id
        name
        photoUri
        latitude
        longitude
      }
    }
  `,
  UPDATE_PLACE: gql`
    mutation(
      $id: ID!
      $name: String
      $photo: Upload
      $latitude: Float
      $longitude: Float
    ) {
      updatePlace(
        id: $id
        name: $name
        photo: $photo
        latitude: $latitude
        longitude: $longitude
      ) {
        id
        name
        photoUri
        latitude
        longitude
      }
    }
  `,
  DELETE_PLACE: gql`
    mutation($id: ID!) {
      deletePlace(id: $id)
    }
  `,
};

export const income = {
  GET_INCOMES: gql`
    query {
      getIncomes {
        id
        amount
        date
        description
        account {
          id
          type
          name
          bank
          initialBalance
          billingDay
          paymentDay
        }
        subCategory {
          id
          name
        }
      }
    }
  `,
  GET_INCOME: gql`
    query($id: ID!) {
      getIncome(id: $id) {
        id
        amount
        date
        description
        account {
          id
          type
          name
          bank
          initialBalance
          billingDay
          paymentDay
        }
        subCategory {
          id
          name
        }
      }
    }
  `,
  CREATE_INCOME: gql`
    mutation(
      $amount: Float!
      $date: Date!
      $description: String
      $accountId: ID!
      $subCategoryId: ID!
    ) {
      createIncome(
        amount: $amount
        date: $date
        description: $description
        accountId: $accountId
        subCategoryId: $subCategoryId
      ) {
        id
        amount
        date
        description
      }
    }
  `,
  UPDATE_INCOME: gql`
    mutation(
      $id: ID!
      $amount: Float
      $date: Date
      $description: String
      $accountId: ID
      $subCategoryId: ID
    ) {
      updateIncome(
        id: $id
        amount: $amount
        date: $date
        description: $description
        accountId: $accountId
        subCategoryId: $subCategoryId
      ) {
        id
        amount
        date
        description
      }
    }
  `,
  DELETE_INCOME: gql`
    mutation($id: ID!) {
      deleteIncome(id: $id)
    }
  `,
};
