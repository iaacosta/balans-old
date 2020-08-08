/// <reference types="cypress" />
/* eslint-disable no-undef */
import { gql } from '@apollo/client';

Cypress.Commands.add('submitForm', () => cy.get('button[type="submit"]').click());

Cypress.Commands.add('findByTestId', (testId) => cy.get(`[data-testid='${testId}']`));

Cypress.Commands.add('getSelectOptions', () => cy.get('[role="presentation"] li'));

Cypress.Commands.add('changeSelectOption', (testId, optionLabel) => {
  cy.findByTestId(testId).click();
  if (optionLabel) {
    cy.get('[role="presentation"] li').contains(optionLabel).click();
  } else {
    cy.get('[role="presentation"] li').last().click();
  }
});

Cypress.Commands.add('attachFileByTestId', (testId, filePath) =>
  cy.findByTestId(testId).within(() => {
    cy.get('input').attachFile(filePath);
  }),
);

Cypress.Commands.add('setupDatabase', (user) => {
  const setupDatabase = gql`
    mutation SetupDatabase($user: CreateUserInput!) {
      setupDatabase(adminUser: $user) {
        id
      }
    }
  `;

  cy.graphQLRequest({ request: setupDatabase, variables: { user } });
});

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
