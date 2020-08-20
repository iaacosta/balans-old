import { createTransactionMutation } from '../graphql/transaction';

Cypress.Commands.add('createTransaction', (transactionInput) =>
  cy
    .graphQLRequest({ request: createTransactionMutation, variables: { input: transactionInput } })
    .then(({ body }) => body.data.createTransaction),
);
