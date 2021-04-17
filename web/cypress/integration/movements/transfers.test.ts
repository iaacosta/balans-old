import { buildTransfer } from '../../support/build/transfer';
import { validationMatchers } from '../../support/matchers';
import { buildAccount } from '../../support/build/account';

const { requiredField } = validationMatchers;

describe('transfers table', () => {
  const testAccounts: GQLCreateDebitAccountMutation['createAccount'][] = [];

  beforeEach(() => {
    cy.fixture('adminUser')
      .then((user) => cy.login(user.username, user.password))
      .then(() => cy.createAccount(buildAccount({ type: 'checking' })))
      .then((fromAccount) => {
        testAccounts.push(fromAccount);
        return cy.createAccount(buildAccount({ type: 'checking' }));
      })
      .then((toAccount) => {
        testAccounts.push(toAccount);
      });
  });

  it('should be able to create a transfer', () => {
    cy.visit('/movements');
    cy.findByTestId('transfersTab').click();
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

    /* should show created transaction */
    cy.get('tbody tr').should('have.length', 1);
  });

  it('should validate transfer fields', () => {
    cy.visit('/movements');
    cy.findByTestId('transfersTab').click();
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

  it('should be able to delete a transfer', () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.createTransfer({
      ...buildTransfer({ amount: 100 }),
      fromAccountId: testAccounts[0].id,
      toAccountId: testAccounts[1].id,
    }).then(([transfer]) => {
      cy.visit('/movements');
      cy.findByTestId('transfersTab').click();

      /* Delete and it shouldn't exist anymore */
      cy.findByTestId(`deleteTransfer${transfer.operationId}`)
        .should('exist')
        .should('not.be.disabled')
        .click();

      /* should notify and show changes */
      cy.findByText(/transfer deleted/i).should('exist');
      cy.findByTestId(`row${transfer.id}`).should('not.exist');
    });
  });
});
