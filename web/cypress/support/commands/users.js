/// <reference types="cypress" />
import { gql } from '@apollo/client';

Cypress.Commands.add('login', (username, password) => {
  const login = gql`
    mutation Login($input: LoginInput!) {
      login(input: $input)
    }
  `;

  return cy
    .graphQLRequest({ request: login, variables: { input: { username, password } } })
    .then(({ body }) => {
      const token = body.data.login;
      localStorage.setItem('x-auth', token);
      return token;
    });
});
