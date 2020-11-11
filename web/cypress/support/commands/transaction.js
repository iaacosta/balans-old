import { createTransactionMutation } from '../graphql/transaction';

Cypress.Commands.add('createTransaction', (transactionInput) =>
  cy
    .graphQLRequest({
      request: createTransactionMutation,
      variables: { input: { ...transactionInput, issuedAt: transactionInput.issuedAt.valueOf() } },
    })
    .then(({ body }) => body.data.createTransaction),
);
