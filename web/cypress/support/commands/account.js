import { createDebitAccountMutation } from '../graphql/accounts';

Cypress.Commands.add('createAccount', (accountInput) =>
  cy
    .graphQLRequest({ request: createDebitAccountMutation, variables: { input: accountInput } })
    .then(({ body }) => body.data.createAccount),
);
