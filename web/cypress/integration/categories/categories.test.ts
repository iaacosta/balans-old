import { capitalize } from 'lodash';
import { validationMatchers } from '../../support/matchers';
import { buildCategory } from '../../support/build/category';

const { requiredField } = validationMatchers;

describe('categories view', () => {
  let testCategory: GQLCreateCategoryMutation['createCategory'];

  beforeEach(() => {
    cy.fixture('adminUser')
      .then((user) => cy.login(user.username, user.password))
      .then(() => cy.createCategory(buildCategory()))
      .then((category) => {
        testCategory = category;
      });

    cy.visit('/categories');
  });

  it('should be able to create a category', () => {
    const newCategory = buildCategory();

    /* open dialog and verify */
    cy.findByTestId('createCategoryButton').should('exist').click();

    /* change fields and submit */
    cy.findByTestId(`nameInput`).within(() => cy.get('input').clear().type(newCategory.name));
    cy.changeSelectOption('typeInput', 'Expense');
    cy.changeColor('colorInput');
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/category created/i).should('exist');

    /* should show created category */
    cy.findByText(newCategory.name).should('exist');
  });

  it('should be able to update a category', () => {
    const modifiedCategory = buildCategory();

    cy.findByTestId(`updateCategory${testCategory.id}`).should('exist').click();

    /* change fields and submit */
    cy.findByTestId(`nameInput`).within(() => cy.get('input').clear().type(modifiedCategory.name));
    cy.changeSelectOption('typeInput', capitalize(modifiedCategory.type));
    cy.changeColor('colorInput');
    cy.submitForm();

    /* should notify changes */
    cy.findByText(/category updated/i).should('exist');

    // /* should show created category */
    cy.findByText(modifiedCategory.name).should('exist');
  });

  it('should validate category fields', () => {
    /* open dialog and verify */
    cy.findByTestId('createCategoryButton').should('exist').click();

    /* required */
    cy.findByTestId('nameInput').within(() => {
      cy.get('input').clear().blur();
      cy.contains(requiredField).should('exist');
    });
  });

  it('should be able to delete a transaction', () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.createCategory(buildCategory()).then((category) => {
      cy.visit('/categories');

      /* Delete and it shouldn't exist anymore */
      cy.findByTestId(`deleteCategory${category.id}`)
        .should('exist')
        .should('not.be.disabled')
        .click();

      /* should notify changes */
      cy.findByText(/category deleted/i).should('exist');

      /* should not find it */
      cy.findByTestId(`category${category.id}`).should('not.exist');
    });
  });
});
