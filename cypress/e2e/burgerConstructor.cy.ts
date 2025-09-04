import { dataSelectors } from "cypress/support/data-selectors";

describe('тест бургер-конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients'
    });
    // }).as('getIngredients');
    cy.visit('http://localhost:4000');
  });

  describe('Выбор ингредиентов', () => {
    it('добавить булку', () => {
      cy.get(dataSelectors.BUN)
        .first()
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.get(dataSelectors.TOPBUN).should(
        'contain',
        'Краторная булка N-200i (верх)'
      );
      cy.get(dataSelectors.BOTTOMBUN).should(
        'contain',
        'Краторная булка N-200i (низ)'
      );
    });

    it('добавить начинку', () => {
      cy.get(dataSelectors.MAIN)
        .first()
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.get(dataSelectors.FILLING).should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('добавить соус', () => {
      cy.get(dataSelectors.SAUSE)
        .first()
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.get(dataSelectors.FILLING).should(
        'contain',
        'Соус Spicy-X'
      );
    });
  });

});