/// <reference types="cypress" />

Cypress.Commands.add('submitForm', () => cy.get('button[type="submit"]').click());

Cypress.Commands.add('changeSelectOption', (testId, idx) => {
  cy.findByTestId(testId).click();
  cy.findByRole('presentation').within(() => cy.get('li').eq(idx).click());
});
