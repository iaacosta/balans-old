import { BaseUser } from '../../support/build/user';
import { validationMatchers } from '../../support/matchers';

describe('login', () => {
  let adminUser: BaseUser;

  beforeEach(() => {
    cy.fixture('adminUser').then((user: BaseUser) => {
      adminUser = user;
    });

    cy.visit('/login');
  });

  it('should be home page if not authenticated', () => {
    cy.visit('/');
    cy.url().should('match', /\/login$/);
  });

  it('should login', () => {
    cy.findByTestId('usernameInput').type(adminUser.username);
    cy.findByTestId('passwordInput').type(adminUser.password);
    cy.findByTestId('rememberMeInput').within(() => cy.get('input').check());
    cy.submitForm();
    cy.url().should('match', /\/$/);
  });

  it('should not login with invalid credentials', () => {
    cy.findByTestId('usernameInput').type('invalid');
    cy.findByTestId('passwordInput').type('credentials');
    cy.submitForm();
    cy.findByText(/incorrect/i).should('exist');
    cy.url().should('match', /\/login$/);
  });

  it('should validate fields', () => {
    cy.findByTestId('usernameInput').within(() => {
      cy.get('input').focus().blur();
      cy.findByText(validationMatchers.requiredField).should('exist');
    });

    cy.findByTestId('passwordInput').within(() => {
      cy.get('input').focus().blur();
      cy.findByText(validationMatchers.requiredField).should('exist');
    });
  });
});
