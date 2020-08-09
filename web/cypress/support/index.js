import '@testing-library/cypress/add-commands';
import './commands';

beforeEach(() => {
  cy.setupDatabase();
  cy.configureCypressTestingLibrary({});
});
