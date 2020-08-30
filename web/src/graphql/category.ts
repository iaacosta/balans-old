import { gql } from '@apollo/client';

export const myCategoriesQuery = gql`
  query MyCategories {
    income: myCategories(type: income) {
      id
      name
      color
    }
    expense: myCategories(type: expense) {
      id
      name
      color
    }
  }
`;
