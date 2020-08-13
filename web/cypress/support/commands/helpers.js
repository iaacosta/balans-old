/// <reference types="cypress" />

Cypress.Commands.add('submitForm', () => cy.get('button[type="submit"]').click());

Cypress.Commands.add('changeSelectOption', (testId, selector) => {
  cy.findByTestId(testId).click();
  cy.findByRole('presentation').within(() => {
    if (typeof selector === 'number') {
      cy.get('li').eq(selector).click();
    } else if (typeof selector === 'string') {
      cy.get('li').within(() => cy.contains(selector).click());
    }
  });
});
