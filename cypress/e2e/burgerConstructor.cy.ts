import { dataSelectors } from "cypress/support/data-selectors";

describe('тест бургер-конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients'
    });
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
      cy.get(dataSelectors.BOTTOM_BUN).should(
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
      cy.get(dataSelectors.SAUCE)
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

  describe('Проверка модалки', () => {
    it('открыть и показывать ингредиент', () => {
      cy.get(dataSelectors.MAIN).first().click();
      cy.get(dataSelectors.MODAL).should('be.visible');
      cy.get(dataSelectors.INGREDIENT_DETAILS).should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
      cy.get(dataSelectors.INGREDIENT_DETAILS).should('be.visible');
    });

    it('открыть и закрыть кликом по крестику', () => {
      cy.get(dataSelectors.MAIN).first().click();
      cy.get(dataSelectors.MODAL).should('be.visible');

      cy.get(dataSelectors.MODAL_CLOSE_BUTTON).click();
      cy.get(dataSelectors.MODAL).should('not.exist');
    });

    it('открыть и закрыть кликом на оверлей', () => {
      cy.get(dataSelectors.MAIN).first().click();
      cy.get(dataSelectors.MODAL).should('be.visible');

      cy.get(dataSelectors.MODAL_OVERLAY).click({ force: true });
      cy.get(dataSelectors.MODAL).should('not.exist');
    });

    it('Закрываем нажатием на ESC', () => {
      cy.get(dataSelectors.MAIN).first().click();
      cy.get(dataSelectors.MODAL).should('be.visible');

      cy.get('body').type('{esc}');
      cy.get(dataSelectors.MODAL).should('not.exist');
    });
  });

  describe('Проверка создания заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' })
      cy.intercept('POST', '**/api/orders', { fixture: 'order' })

      window.localStorage.setItem('refreshToken', 'refreshToken');
      cy.setCookie('accessToken', 'accessToken');

      cy.visit('http://localhost:4000');
    });

    afterEach(() => {
      window.localStorage.removeItem('refreshToken');
      cy.clearCookie('accessToken');
    });

    it('создать заказ', () => {
      cy.get(dataSelectors.BUN)
        .first()
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.get(dataSelectors.MAIN)
        .first()
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

      cy.get(dataSelectors.SAUCE)
        .first()
        .within(() => {
          cy.get('button').contains('Добавить').click();
        });

    // создание заказа
      cy.get(dataSelectors.CREATE_ORDER_BUTTON).click();

    // проверка номера заказа
      cy.get(dataSelectors.ORDER_DETAILS).should('be.visible');
      cy.get(dataSelectors.ORDER_DETAILS).should('contain', '87794');

      
      // проверка очистки формы
      cy.get(dataSelectors.TOPBUN).should('contain', 'Выберите булки');
      cy.get(dataSelectors.BOTTOM_BUN).should(
        'contain',
        'Выберите булки'
      );
      cy.get(dataSelectors.FILLING).should(
        'contain',
        'Выберите начинку'
      );
      
      // закрываем модалку об успешном заказе
      cy.get(dataSelectors.MODAL)
      .find(dataSelectors.MODAL_CLOSE_BUTTON).click();
      cy.get(dataSelectors.ORDER_DETAILS).should('not.exist');
    });
  });
  
});