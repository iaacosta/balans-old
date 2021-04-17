import { createCategoryMutation } from '../graphql/categories';

Cypress.Commands.add('createCategory', (categoryInput) =>
  cy
    .graphQLRequest({ request: createCategoryMutation, variables: { input: categoryInput } })
    .then(({ body }) => body.data.createCategory),
);
