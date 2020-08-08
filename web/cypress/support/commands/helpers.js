/// <reference types="cypress" />

Cypress.Commands.add('submitForm', () => cy.get('button[type="submit"]').click());

Cypress.Commands.add('findByTestId', (testId) => cy.get(`[data-testid='${testId}']`));

Cypress.Commands.add('getSelectOptions', () => cy.get('[role="presentation"] li'));

Cypress.Commands.add('changeSelectOption', (testId, optionLabel) => {
  cy.findByTestId(testId).click();
  if (optionLabel) {
    cy.get('[role="presentation"] li').contains(optionLabel).click();
  } else {
    cy.get('[role="presentation"] li').last().click();
  }
});

Cypress.Commands.add('attachFileByTestId', (testId, filePath) =>
  cy.findByTestId(testId).within(() => {
    cy.get('input').attachFile(filePath);
  }),
);
