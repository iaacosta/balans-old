import { buildUser } from '../../support/build/user';
import { validationMatchers } from '../../support/matchers';

describe('active users table', () => {
  let adminUser: MeQuery['me'];
  let testUser: CreateUserMutation['createUser'];

  beforeEach(() => {
    cy.fixture('adminUser').then((user) => cy.login(user.username, user.password));

    // get my info
    cy.getMe().then((user) => {
      adminUser = user;
    });

    // create test user
    cy.createUser(buildUser()).then((user) => {
      testUser = user;
    });

    cy.visit('/users');
  });

  it('should be able to soft delete a user and not be able to delete myself', () => {
    const rowId = `row${testUser.id}`;
    const deleteId = `deleteUser${testUser.id}`;

    /* Delete and it shouldn't exist anymore */
    cy.findByTestId(deleteId).should('exist').should('not.be.disabled').click();
    cy.findByTestId(rowId).should('not.exist');

    /* Can't delete myself */
    cy.findByTestId(`deleteUser${adminUser.id}`).should('exist').should('be.disabled');

    /* If I change tab, I should see soft deleted user */
    cy.contains(/^deleted users$/i).click();
    cy.findByTestId(rowId).should('exist');
  });

  it('should be able to update a user', () => {
    const rowId = `row${testUser.id}`;
    const updateId = `updateUser${testUser.id}`;
    const newUser = buildUser();

    /* open dialog and verify */
    cy.findByTestId(updateId).should('exist').should('not.be.disabled').click();

    /* change fields and submit */
    cy.changeSelectOption('roleInput', 1);
    (['firstName', 'lastName', 'email', 'password'] as const).forEach((field) =>
      cy.findByTestId(`${field}Input`).within(() => cy.get('input').clear().type(newUser[field])),
    );
    cy.submitForm();

    /* expect changes to be there */
    cy.findByTestId(rowId)
      .children()
      .should('contain', `${newUser.firstName} ${newUser.lastName}`)
      .and('contain', newUser.email)
      .and('contain', 'Admin');

    /* i should not be allowed to change my role */
    cy.findByTestId(`updateUser${adminUser.id}`).click();
    cy.findByTestId('roleInput').should('have.class', 'Mui-disabled');
  });

  it('should validate user update', () => {
    const updateId = `updateUser${testUser.id}`;

    /* open dialog and verify */
    cy.findByTestId(updateId).should('exist').should('not.be.disabled').click();

    /* validate */
    cy.findByTestId('firstNameInput').within(() => {
      cy.get('input').clear().focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');
    });

    cy.findByTestId('lastNameInput').within(() => {
      cy.get('input').clear().focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');
    });

    cy.findByTestId('emailInput').within(() => {
      cy.get('input').clear().focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');

      cy.get('input').type('a');
      cy.contains(validationMatchers.beEmail).should('exist');
    });

    cy.findByTestId('passwordInput').within(() => {
      cy.get('input').type('a').blur();
      cy.contains(validationMatchers.minimumLength).should('exist');
    });
  });
});
