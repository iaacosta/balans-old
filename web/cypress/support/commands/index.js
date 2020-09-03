/// <reference types="cypress" />
import './helpers';
import './database';
import './users';
import './account';
import './transaction';
import './transfer';
import './category';

Cypress.Commands.add('graphQLRequest', ({ request, variables = {} }) => {
  const token = localStorage.getItem('x-auth');

  return cy
    .request({
      url: `${Cypress.env('API_URL')}/graphql`,
      method: 'POST',
      headers: token ? { authorization: `Bearer ${token}` } : {},
      body: {
        query: request.loc.source.body,
        operationName: request.definitions[0].name.value,
        variables,
      },
    })
    .then((response) => {
      if (!response.body.data) throw new Error(JSON.stringify(response.body.errors, null, 2));
      return response;
    });
});
