/* eslint-disable no-undef */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { gql } from '@apollo/client';
import { adminUser } from './build/user';
import './commands';

before(() => {
  cy.resetDatabase();
  const signUp = gql`
    mutation SignUp($input: CreateUserInput!) {
      signUp(input: $input)
    }
  `;

  cy.graphQLRequest({ query: signUp, variables: { input: adminUser } });
});
