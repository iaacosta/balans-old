import { gql } from '@apollo/client';

/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/// <reference types="cypress" />

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

Cypress.Commands.add('resetDatabase', () => {
  const query = gql`
    mutation ResetDatabase {
      resetDatabase
    }
  `;

  cy.graphQLRequest({ query });
});

Cypress.Commands.add('graphQLRequest', ({ query, variables = {} }) => {
  const token = localStorage.getItem('x-auth');

  cy.request({
    url: `${Cypress.env('API_URL')}/graphql`,
    method: 'POST',
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body: {
      query: query.loc.source.body,
      operationName: query.definitions[0].name.value,
      variables,
    },
  });
});
