import { gql } from '@apollo/client';

export const myCategoriesQuery = gql`
  query MyCategories {
    income: myCategories(type: income) {
      id
      name
    }
    expense: myCategories(type: expense) {
      id
      name
    }
  }
`;
