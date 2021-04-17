/// <reference types="cypress" />

import { setupDatabaseMutation } from '../graphql/test';

Cypress.Commands.add('setupDatabase', () => {
  cy.fixture('adminUser').then((user) =>
    cy.graphQLRequest({
      request: setupDatabaseMutation,
      variables: { user: { ...user, role: undefined } },
    }),
  );
});
