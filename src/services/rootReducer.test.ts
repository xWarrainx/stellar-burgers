import { rootReducer } from './rootReducer';
import type { RootState } from './rootReducer';

// Основные моки API
jest.mock(
  '@api',
  () => ({
    getIngredientsApi: jest.fn(),
    getFeedsApi: jest.fn(),
    getOrdersApi: jest.fn(),
    orderBurgerApi: jest.fn(),
    getOrderByNumberApi: jest.fn(),
    registerUserApi: jest.fn(),
    loginUserApi: jest.fn(),
    forgotPasswordApi: jest.fn(),
    resetPasswordApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn(),
    logoutApi: jest.fn()
  }),
  { virtual: true }
);

// Моки для cookie-утилит (используем относительный путь)
jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('Обработка rootReducer', () => {
  it('Обработка инициации начального состояния', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    const expectedState: RootState = {
      ingredients: {
        items: [],
        currentIngredient: null,
        loading: false,
        error: null
      },
      constructorItems: {
        bun: null,
        ingredients: []
      },
      order: {
        loading: false,
        order: null,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        profileOrders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      }
    };

    expect(initialState).toEqual(expectedState);
  });
});
