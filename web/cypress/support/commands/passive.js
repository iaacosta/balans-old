import { createPassiveMutation, liquidatePassiveMutation } from '../graphql/passive';

Cypress.Commands.add('createPassive', (passiveInput) =>
  cy
    .graphQLRequest({
      request: createPassiveMutation,
      variables: { input: { ...passiveInput, issuedAt: passiveInput.issuedAt.valueOf() } },
    })
    .then(({ body }) => body.data.createPassive),
);

Cypress.Commands.add('liquidatePassive', (liquidateInput) =>
  cy
    .graphQLRequest({
      request: liquidatePassiveMutation,
      variables: { input: liquidateInput },
    })
    .then(({ body }) => body.data.liquidatePassive),
);
