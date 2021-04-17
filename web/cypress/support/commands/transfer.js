import { createTransferMutation } from '../graphql/transfer';

Cypress.Commands.add('createTransfer', (transferInput) =>
  cy
    .graphQLRequest({
      request: createTransferMutation,
      variables: { input: { ...transferInput, issuedAt: transferInput.issuedAt.valueOf() } },
    })
    .then(({ body }) => body.data.createTransfer),
);
