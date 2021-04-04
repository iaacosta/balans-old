import { buildTransaction } from '../../support/build/transaction';
import { validationMatchers } from '../../support/matchers';
import { buildAccount } from '../../support/build/account';
import { buildCategory } from '../../support/build/category';

const { requiredField } = validationMatchers;

describe('transactions table', () => {
  let testAccount: GQLCreateDebitAccountMutation['createAccount'];
  let testTransaction: GQLCreateTransactionMutation['createTransaction'];
  let testCategories: CategoryPair;

  beforeEach(() => {
    cy.fixture('adminUser')
      .then((user) => cy.login(user.username, user.password))
      .then(() => cy.createAccount(buildAccount({ initialBalance: 0, type: 'checking' })))
      .then((createdAccount) => {
        testAccount = createdAccount;
        return cy.createCategory(buildCategory({ type: 'income' }));
      })
      .then((incomeCategory) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        testCategories = { income: incomeCategory } as any;
        return cy.createCategory(buildCategory({ type: 'expense' }));
      })
      .then((expenseCategory) => {
        testCategories.expense = expenseCategory;
        return cy.createTransaction({
          ...buildTransaction({ amount: 10000 }),
          accountId: testAccount.id,
          categoryId: testCategories.income.id,
        });
      })
      .then((createdTransaction) => {
        testTransaction = createdTransaction;
      });

    cy.visit('/movements');
  });

  it('should be able to create a transaction', () => {
    const newTransaction = buildTransaction();

    /* open dialog and verify */
    cy.findByTestId('createTransactionButton').should('exist').click();

    /* change fields and submit */
    cy.findByTestId(`amountInput`).within(() =>
      cy.get('input').clear().type(`${newTransaction.amount}`),
    );
    cy.changeSelectOption('typeInput', 'Income');
    cy.findByTestId('memoInput').within(() =>
      cy
        .get('input')
        .clear()
        .type(newTransaction.memo || ''),
    );
    cy.changeSelectOption('accountIdInput', 0);
    cy.changeSelectOption('categoryIdInput', 0);
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/transaction created/i).should('exist');

    /* should show created transaction */
    cy.get('tbody tr').should('have.length', 1);
  });

  /* TODO: figure a way of testing the date dynamically */

  it('should be able to update a transaction', () => {
    const rowId = `row${testTransaction.id}`;
    const updateId = `updateTransaction${testTransaction.id}`;
    const newTransaction = buildTransaction({ amount: 10000 });

    /* open dialog and verify */
    cy.findByTestId(updateId).should('exist').should('not.be.disabled').click();

    /* change fields and submit */
    cy.findByTestId(`amountInput`).within(() =>
      cy.get('input').clear().type(`${newTransaction.amount}`),
    );
    cy.changeSelectOption('typeInput', 'Expense');
    cy.findByTestId('memoInput').within(() =>
      cy
        .get('input')
        .clear()
        .type(newTransaction.memo || ''),
    );
    cy.changeSelectOption('categoryIdInput', 0);

    cy.submitForm();

    /* expect changes to be there */
    cy.findByTestId(rowId)
      .children()
      .should('contain', '(10.000)')
      .and('contain', `${testAccount.name} (${testAccount.bank})`)
      .and('contain', newTransaction.memo)
      .and('contain', testCategories.expense.name);
  });

  /* TODO: should not allow transaction that makes vista/cash account negative */

  it('should validate transaction fields', () => {
    /* open dialog and verify */
    cy.findByTestId('createTransactionButton').should('exist').click();

    /* required */
    cy.submitForm();
    cy.findByTestId('amountInput').within(() => {
      cy.get('input').clear();
      cy.contains(requiredField).should('exist');
    });
    cy.changeSelectOption('typeInput', 'Income');

    /* non zero value */
    cy.findByTestId('amountInput').within(() => {
      cy.get('input').clear().type('0');
      cy.contains(/greater than 0/i).should('exist');
    });
  });

  it('should be able to delete a transaction', () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.createTransaction({
      ...buildTransaction({ amount: -1000 }),
      accountId: testAccount.id,
      categoryId: testCategories.expense.id,
    }).then((transaction) => {
      /* Delete and it shouldn't exist anymore */
      cy.findByTestId(`deleteTransaction${transaction.id}`)
        .should('exist')
        .should('not.be.disabled')
        .click();

      cy.findByTestId(`row${transaction.id}`).should('not.exist');
    });
  });
});
