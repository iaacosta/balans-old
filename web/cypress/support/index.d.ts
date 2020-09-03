/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="cypress" />

type BuildEntityOmit<T, O extends string> = Omit<
  T,
  O | 'id' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;

type CategoryPair = {
  income: GQLCreateCategoryMutation['createCategory'];
  expense: GQLCreateCategoryMutation['createCategory'];
};

declare namespace Cypress {
  interface Chainable {
    /* Helpers */
    /**
     * Custom command to press a submit button in a form
     * @example cy.submitForm()
     */
    submitForm(): Chainable<Element>;
    /**
     * Custom command to get change options of a Material UI
     * select field
     * @example cy.changeSelectOption('testInput', 2);
     * @example cy.changeSelectOption('testInput', 'option');
     */
    changeSelectOption(testId: string, selector: number | string): Chainable<void>;
    /**
     * Custom command to change a color picker to random
     * @example cy.changeColor('testInput');
     */
    changeColor(testId: string): Chainable<void>;

    /* Users */
    /**
     * Login to the platform with user and password
     * @example cy.login('user', 'password')
     */
    login(username: string, password: string): Chainable<string>;
    /**
     * Gets the data of the logged in user
     * @example cy.getMe()
     */
    getMe(): Chainable<GQLMeQuery['me']>;
    /**
     * Creates a user
     * @example cy.createUser(buildUser())
     */
    createUser(
      user: GQLCreateUserMutationVariables['input'],
    ): Chainable<GQLCreateUserMutation['createUser']>;
    /**
     * Deletes a user
     * @example cy.deleteUser(1)
     */
    deleteUser(id: Scalars['ID']): Chainable<GQLDeleteUserMutation['deleteUser']>;

    /* Accounts */
    /**
     * Creates an account
     * @example cy.createAccount(buildAccount())
     */
    createAccount(
      account: GQLCreateDebitAccountMutationVariables['input'],
    ): Chainable<GQLCreateDebitAccountMutation['createAccount']>;

    /* Transactions */
    /**
     * Creates a transaction
     * @example cy.createTransaction(buildTransaction())
     */
    createTransaction(
      transaction: GQLCreateTransactionMutationVariables['input'],
    ): Chainable<GQLCreateTransactionMutation['createTransaction']>;

    /* Transfers */
    /**
     * Creates a transfer
     * @example cy.createTransfer(buildTransfer())
     */
    createTransfer(
      transfer: GQLCreateTransferMutationVariables['input'],
    ): Chainable<GQLCreateTransferMutation['createTransfer']>;

    /* Categories */
    /**
     * Creates an category
     * @example cy.createCategory(buildCategory())
     */
    createCategory(
      category: GQLCreateCategoryMutationVariables['input'],
    ): Chainable<GQLCreateCategoryMutation['createCategory']>;

    /* Database */
    /**
     * Command to setup database in backend side
     * @example cy.setupDatabase()
     */
    setupDatabase(): Chainable<GQLSetupDatabaseMutation['setupDatabase']>;

    /* Main */
    /**
     * Custom command to send a GraphQL request
     * @example cy.graphQLRequest({ request: gql`...`, variables: { foo: 'bar' } })
     */
    graphQLRequest(request: {
      request: any;
      variables: { [key: string]: any };
    }): Chainable<Cypress.Response>;
  }
}
