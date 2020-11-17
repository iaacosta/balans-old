import { buildPassive } from '../../support/build/passive';
import { validationMatchers } from '../../support/matchers';
import { buildAccount } from '../../support/build/account';

const { requiredField } = validationMatchers;

describe('passives table', () => {
  beforeEach(() => {
    cy.fixture('adminUser')
      .then((user) => cy.login(user.username, user.password))
      .then(() => cy.createAccount(buildAccount({ initialBalance: 0, type: 'checking' })));

    cy.visit('/movements');
  });

  it('should be able to create a passive', () => {
    const newPassive = buildPassive();

    /* open dialog and verify */
    cy.findByTestId('passivesTab').click();
    cy.findByTestId('createPassiveButton').should('exist').click();

    /* change fields and submit */
    cy.findByTestId(`amountInput`).within(() =>
      cy.get('input').clear().type(`${newPassive.amount}`),
    );
    cy.changeSelectOption('typeInput', 'Loan');
    cy.findByTestId('memoInput').within(() =>
      cy
        .get('input')
        .clear()
        .type(newPassive.memo || ''),
    );
    cy.changeSelectOption('accountIdInput', 0);
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/passive created/i).should('exist');
  });

  it('should validate passive fields', () => {
    cy.findByTestId('passivesTab').click();

    /* open dialog and verify */
    cy.findByTestId('createPassiveButton').should('exist').click();

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
  });
});
