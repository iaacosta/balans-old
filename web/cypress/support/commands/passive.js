import { createPassiveMutation } from '../graphql/passive';

Cypress.Commands.add('createPassive', (passiveInput) =>
  cy
    .graphQLRequest({
      request: createPassiveMutation,
      variables: { input: { ...passiveInput, issuedAt: passiveInput.issuedAt.valueOf() } },
    })
    .then(({ body }) => body.data.createPassive),
);
