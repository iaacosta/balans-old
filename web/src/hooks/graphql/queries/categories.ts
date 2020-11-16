import { gql } from '@apollo/client';

export const myCategoriesQuery = gql`
  query MyCategories {
    income: myCategories(type: income) {
      id
      name
      color
      type
    }
    expense: myCategories(type: expense) {
      id
      name
      color
      type
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

export const updateCategoryMutation = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
      type
      color
    }
  }
`;

export const deleteCategoryMutation = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
