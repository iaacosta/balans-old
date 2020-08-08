/// <reference types="cypress" />
import { gql } from '@apollo/client';

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
