import { buildAccount } from '../../support/build/account';
import { validationMatchers } from '../../support/matchers';

const { requiredField, minimumNumber } = validationMatchers;

describe('debit accounts table', () => {
  beforeEach(() => {
    cy.fixture('adminUser').then((user) => cy.login(user.username, user.password));
    cy.visit('/accounts');
  });

  it('should be able to create an account', () => {
    const newAccount = buildAccount();

    /* open dialog and verify */
    cy.findByTestId('createAccountButton').should('exist').click();

    /* change fields and submit */
    (['name', 'initialBalance'] as const).forEach((field) =>
      cy
        .findByTestId(`${field}Input`)
        .within(() => cy.get('input').clear().type(`${newAccount[field]}`)),
    );
    cy.changeSelectOption('typeInput', 1);
    cy.changeSelectOption('bankInput', 2);
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/account created/i).should('exist');

    /* should show created account */
    cy.findAllByTestId('account').should('have.length', 1);
  });

  it('should validate account fields', () => {
    /* open dialog and verify */
    cy.findByTestId('createAccountButton').should('exist').click();

    /* required */
    cy.submitForm();
    cy.findByTestId('nameInput').within(() => cy.contains(requiredField).should('exist'));
    cy.findByTestId('initialBalanceInput').within(() => {
      cy.get('input').clear();
      cy.contains(requiredField).should('exist');
    });
    cy.findByTestId('bankInput').within(() => cy.contains(requiredField).should('exist'));
    cy.findByTestId('typeInput').within(() => cy.contains(requiredField).should('exist'));

    /* initial balance if checking */
    cy.changeSelectOption('typeInput', 'Checking');
    cy.findByTestId('initialBalanceInput').within(() => {
      cy.get('input').clear().type(`-1000`);
      cy.contains(requiredField).should('not.exist');
    });

    /* initial balance if vista */
    cy.changeSelectOption('typeInput', 'Vista');
    cy.findByTestId('initialBalanceInput').within(() => cy.contains(minimumNumber).should('exist'));

    /* initial balance if cash */
    cy.changeSelectOption('typeInput', 'Cash');
    cy.findByTestId('initialBalanceInput').within(() => cy.contains(minimumNumber).should('exist'));

    /* should hide bank input */
    cy.findByTestId('bankInput').should('not.exist');
  });

  it('should be able to delete an account', () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.createAccount(buildAccount()).then((account) => {
      /* Delete and it shouldn't exist anymore */
      cy.findByTestId(`deleteAccount${account.id}`)
        .should('exist')
        .should('not.be.disabled')
        .click();

      cy.findByTestId(`account${account.id}`).should('not.exist');
    });
  });
});
