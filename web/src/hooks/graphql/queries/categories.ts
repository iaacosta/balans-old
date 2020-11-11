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

export const createCategoryMutation = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`;

export const deleteCategoryMutation = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
