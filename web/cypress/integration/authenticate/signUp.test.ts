import { buildUser } from '../../support/build/user';
import { validationMatchers } from '../../support/matchers';

describe('sign up', () => {
  beforeEach(() => cy.visit('/signUp'));

  it('should be accesible from login', () => {
    cy.visit('/');
    cy.contains(/sign up/i).click();
    cy.url().should('match', /\/signUp$/i);
  });

  it('should be able to go back to login', () => {
    cy.contains(/log in/i).click();
    cy.url().should('match', /\/login$/i);
  });

  it('should signUp', () => {
    const newUser = buildUser();

    cy.findByTestId('firstNameInput').type(newUser.firstName);
    cy.findByTestId('lastNameInput').type(newUser.lastName);
    cy.findByTestId('emailInput').type(newUser.email);
    cy.findByTestId('usernameInput').type(newUser.username);
    cy.findByTestId('passwordInput').type(newUser.password);
    cy.findByTestId('confirmPasswordInput').type(newUser.password);

    cy.submitForm();
    cy.url().should('match', /\/$/);
    cy.findByTestId('userFullName').should(
      'contain.text',
      `${newUser.firstName} ${newUser.lastName}`,
    );
  });

  it('should validate fields', () => {
    cy.findByTestId('firstNameInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');
    });

    cy.findByTestId('lastNameInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');
    });

    cy.findByTestId('emailInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');

      cy.get('input').type('a');
      cy.contains(validationMatchers.beEmail).should('exist');
    });

    cy.findByTestId('usernameInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(validationMatchers.requiredField).should('exist');

      cy.get('input').type('a');
      cy.contains(validationMatchers.minimumLength).should('exist');

      cy.get('input').clear().type('*&!@#()=');
      cy.contains(validationMatchers.username).should('exist');
    });

    cy.findByTestId('passwordInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(/required/i).should('exist');

      cy.get('input').type('a');
      cy.contains(validationMatchers.minimumLength).should('exist');
    });

    cy.findByTestId('confirmPasswordInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(/required/i).should('exist');

      cy.get('input').type('b');
      cy.contains(validationMatchers.confirmPassword).should('exist');
    });

    cy.submitForm();
    cy.url().should('match', /\/signUp$/i);
  });
});
