/// <reference types="cypress" />
import { loginMutation, createUserMutation, meQuery, deleteUserMutation } from '../graphql/users';

Cypress.Commands.add('login', (username, password) =>
  cy
    .graphQLRequest({ request: loginMutation, variables: { input: { username, password } } })
    .then(({ body }) => {
      const token = body.data.login;
      localStorage.setItem('x-auth', token);
      return token;
    }),
);

Cypress.Commands.add('getMe', () =>
  cy.graphQLRequest({ request: meQuery }).then(({ body }) => body.data.me),
);

Cypress.Commands.add('createUser', (userInput) =>
  cy
    .graphQLRequest({ request: createUserMutation, variables: { input: userInput } })
    .then(({ body }) => body.data.createUser),
);

Cypress.Commands.add('deleteUser', (id) =>
  cy
    .graphQLRequest({ request: deleteUserMutation, variables: { id } })
    .then(({ body }) => body.data.deleteUser),
);
