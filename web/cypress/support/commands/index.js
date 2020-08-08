/// <reference types="cypress" />
import './helpers';
import './database';

Cypress.Commands.add('graphQLRequest', ({ request, variables = {} }) => {
  const token = localStorage.getItem('x-auth');

  return cy.request({
    url: `${Cypress.env('API_URL')}/graphql`,
    method: 'POST',
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body: {
      query: request.loc.source.body,
      operationName: request.definitions[0].name.value,
      variables,
    },
  });
});
