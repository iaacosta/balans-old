import { buildUser } from '../../support/build/user';

describe('deleted users table', () => {
  let testUser: CreateUserMutation['createUser'];

  beforeEach(() => {
    cy.fixture('adminUser').then((user) => cy.login(user.username, user.password));

    // create and soft deletes test user
    cy.createUser(buildUser()).then((user) => {
      testUser = user;
      return cy.deleteUser(user.id);
    });

    cy.visit('/users');
    cy.contains(/^deleted users$/i).click();
  });

  it('should be able to restore a deleted user', () => {
    const rowId = `row${testUser.id}`;
    const restoreId = `restoreUser${testUser.id}`;

    /* restore and it shouldn't exist anymore */
    cy.findByTestId(restoreId).should('exist').should('not.be.disabled').click();
    cy.findByTestId(rowId).should('not.exist');

    /* if I change tab, I should see restored user */
    cy.contains(/^active users$/i).click();
    cy.findByTestId(rowId).should('exist');
  });
});
