describe('тест бургер-конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients'
    }).as('getIngredients');

    cy.visit('http://localhost:4000');
  });
});