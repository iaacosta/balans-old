import { buildTransfer } from '../../support/build/transfer';
import { validationMatchers } from '../../support/matchers';
import { buildAccount } from '../../support/build/account';

const { requiredField } = validationMatchers;

describe('transfers table', () => {
  const testAccounts: GQLCreateDebitAccountMutation['createAccount'][] = [];

  beforeEach(() => {
    cy.fixture('adminUser')
      .then((user) => cy.login(user.username, user.password))
      .then(() => cy.createAccount(buildAccount({ initialBalance: 0, type: 'checking' })))
      .then((account) => {
        testAccounts.push(account);
        return cy.createAccount(buildAccount({ initialBalance: 5000, type: 'checking' }));
      })
      .then((account) => testAccounts.push(account));

    cy.visit('/movements');
    cy.findByTestId('transfersTab').click();
  });

  it('should be able to create a transfer', () => {
    const newTransfer = buildTransfer();

    /* open dialog and verify */
    cy.findByTestId('createTransferButton').should('exist').click();

    /* change fields and submit */
    cy.findByTestId(`amountInput`).within(() =>
      cy.get('input').clear().type(`${newTransfer.amount}`),
    );
    cy.findByTestId('memoInput').within(() =>
      cy
        .get('input')
        .clear()
        .type(newTransfer.memo || ''),
    );
    cy.changeSelectOption('fromAccountIdInput', 0);
    cy.changeSelectOption('toAccountIdInput', 1);
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/transfer created/i).should('exist');
  });

  it('should validate transfer fields', () => {
    /* open dialog and verify */
    cy.findByTestId('createTransferButton').should('exist').click();

    /* required */
    cy.submitForm();
    cy.findByTestId('amountInput').within(() => {
      cy.get('input').clear();
      cy.contains(requiredField).should('exist');
    });

    /* non zero value */
    cy.findByTestId('amountInput').within(() => {
      cy.get('input').clear().type('0');
      cy.contains(/greater than 0/i).should('exist');
    });

    /* not equal */
    cy.changeSelectOption('fromAccountIdInput', 0);
    cy.changeSelectOption('toAccountIdInput', 0);

    cy.findByTestId('fromAccountIdInput').within(() =>
      cy.contains(/must be different/i).should('exist'),
    );

    cy.findByTestId('toAccountIdInput').within(() =>
      cy.contains(/must be different/i).should('exist'),
    );
  });
});
