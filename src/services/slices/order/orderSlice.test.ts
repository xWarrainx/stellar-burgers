import orderReducer, { createOrder, clearOrder } from './orderSlice';
import { TOrder } from '@utils-types';

jest.mock(
  '@api',
  () => ({
    orderBurgerApi: jest.fn()
  }),
  { virtual: true }
);

describe('orderSlice', () => {
  const initialState = {
    loading: false,
    order: null,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-04-12T10:00:00.000Z',
    updatedAt: '2023-04-12T10:00:30.000Z',
    number: 12345
  };

  describe('Обработка синхронного экшена', () => {
    it('Очищаем заказ (clearOrder)', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder
      };
      const state = orderReducer(stateWithOrder, clearOrder());
      expect(state.order).toBeNull();
    });
  });

  describe('Обработка асинхронного экшена createOrder', () => {
    it('Обработка pending', () => {
      const state = orderReducer(initialState, createOrder.pending('', []));
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Обработка fulfilled', () => {
      const pendingState = {
        ...initialState,
        loading: true
      };
      const state = orderReducer(
        pendingState,
        createOrder.fulfilled(mockOrder, '', [])
      );
      expect(state).toEqual({
        ...initialState,
        order: mockOrder,
        loading: false
      });
    });

    it('Обработка rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const pendingState = {
        ...initialState,
        loading: true
      };
      const state = orderReducer(
        pendingState,
        createOrder.rejected(new Error(errorMessage), '', [], errorMessage)
      );
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
