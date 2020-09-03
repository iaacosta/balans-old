import { createTransferMutation } from '../graphql/transfer';

Cypress.Commands.add('createTransfer', (transferInput) =>
  cy
    .graphQLRequest({ request: createTransferMutation, variables: { input: transferInput } })
    .then(({ body }) => body.data.createTransfer),
);
