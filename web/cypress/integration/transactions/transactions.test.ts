import { buildTransaction } from '../../support/build/transaction';
import { validationMatchers } from '../../support/matchers';
import { buildAccount } from '../../support/build/account';

const { requiredField, nonZero } = validationMatchers;

describe('debit transactions table', () => {
  beforeEach(() => {
    cy.fixture('adminUser')
      .then((user) => cy.login(user.username, user.password))
      .then(() => cy.createAccount(buildAccount()));
    cy.visit('/transactions');
  });

  it('should be able to create an transaction', () => {
    const newTransaction = buildTransaction();

    /* open dialog and verify */
    cy.findByTestId('createTransactionButton').should('exist').click();

    /* change fields and submit */
    cy.findByTestId(`amountInput`).within(() =>
      cy.get('input').clear().type(`${newTransaction.amount}`),
    );
    cy.changeSelectOption('accountIdInput', 0);
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/transaction created/i).should('exist');
  });

  it('should validate transaction fields', () => {
    /* open dialog and verify */
    cy.findByTestId('createTransactionButton').should('exist').click();

    /* required */
    cy.submitForm();
    cy.findByTestId('amountInput').within(() => {
      cy.get('input').clear();
      cy.contains(requiredField).should('exist');
    });
    cy.findByTestId('accountIdInput').within(() => cy.contains(requiredField).should('exist'));

    /* non zero value */
    cy.findByTestId('amountInput').within(() => {
      cy.get('input').clear().type('0');
      cy.contains(nonZero).should('exist');
    });
  });
});
