describe('Успешное добавление ингредиентов в конструктор', () => {
  beforeEach(() => {
    //Настройка перехвата запросов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('Добавление булки', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Ингредиент 1')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Ингредиент 1')
      .should('exist');
  });

  it('Добавление основного ингредиента', () => {
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ингредиент 3')
      .should('exist');
  });

  it('Добавление соуса', () => {
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ингредиент 5')
      .should('exist');
  });
});

describe('Успешное открытие и закрытие модальных окон', () => {
  beforeEach(() => {
    //Настройка перехвата запросов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('Открытие модального окна', () => {
    cy.contains('Ингредиент 1').click();
    cy.get('[data-cy=modal]').should('be.visible').contains('Ингредиент 1');
  });

  it('Закрытие модального окна по клику на кнопку', () => {
    cy.contains('Ингредиент 1').click();
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Закрытие модального окна по клику на оверлай', () => {
    cy.contains('Ингредиент 1').click();
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});

describe('Успешное создание заказа', () => {
  beforeEach(() => {
    //Настройка перехвата запросов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );
    //Подставляем моковые токены
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Заказ оформлен', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=mains-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=sauces-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=order-button]').click();
    cy.wait('@postOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '3', '5', '1']
      });
    cy.get('[data-cy=order-number]').contains('123456789').should('exist');
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ингредиент 3')
      .should('not.exist');
    cy.get('[data-cy=constructor-ingredient]')
      .contains('Ингредиент 5')
      .should('not.exist');
  });
});
