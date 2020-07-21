import { adminUser } from '../../support/build/user';

describe('login', () => {
  beforeEach(() => cy.visit('/login'));

  it('should be home page if not authenticated', () => {
    cy.visit('/');
    cy.url().should('match', /\/login$/);
  });

  it('should login', () => {
    cy.findByTestId('usernameInput').type(adminUser.username);
    cy.findByTestId('passwordInput').type(adminUser.password);
    cy.findByTestId('rememberMeInput').within(() => {
      cy.get('input').check();
    });
    cy.submitForm();
    cy.url().should('match', /\/$/);
  });

  it('should not login with invalid credentials', () => {
    cy.findByTestId('usernameInput').type('invalid');
    cy.findByTestId('passwordInput').type('credentials');
    cy.submitForm();
    cy.contains(/incorrect/i).should('exist');
    cy.url().should('match', /\/login$/);
  });

  it('should validate fields', () => {
    cy.findByTestId('usernameInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(/required/i).should('exist');
    });

    cy.findByTestId('passwordInput').within(() => {
      cy.get('input').focus().blur();
      cy.contains(/required/i).should('exist');
    });
  });
});
