import feedReducer, { fetchFeeds, fetchProfileOrders } from './feedSlice';
import { TOrder } from '@utils-types';

jest.mock(
  '@api',
  () => ({
    getFeedsApi: jest.fn().mockResolvedValue({
      success: true,
      orders: [],
      total: 0,
      totalToday: 0
    }),
    getOrdersApi: jest.fn().mockResolvedValue([])
  }),
  { virtual: true }
);

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    profileOrders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['60d3b41abdacab0026a733c6'],
    status: 'done',
    name: 'Space флюоресцентный бургер',
    createdAt: '2023-04-12T10:00:00.000Z',
    updatedAt: '2023-04-12T10:00:30.000Z',
    number: 12345
  };

  const mockFeedsResponse = {
    success: true,
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  describe('Обработка асинхронного экшена fetchFeeds', () => {
    it('Обработка pending', () => {
      const state = feedReducer(initialState, fetchFeeds.pending(''));
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Обработка fulfilled', () => {
      const state = feedReducer(
        initialState,
        fetchFeeds.fulfilled(mockFeedsResponse, '')
      );

      expect(state).toEqual({
        ...initialState,
        orders: mockFeedsResponse.orders,
        total: mockFeedsResponse.total,
        totalToday: mockFeedsResponse.totalToday,
        loading: false
      });
    });

    it('Обработка rejected', () => {
      const error = 'Ошибка получения заказа';
      const state = feedReducer(
        initialState,
        fetchFeeds.rejected(new Error(error), '', undefined, error)
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });
  });

  describe('Обработка асинхронного экшена fetchProfileOrders', () => {
    it('Обработка pending', () => {
      const state = feedReducer(initialState, fetchProfileOrders.pending(''));

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('Обработка fulfilled', () => {
      const state = feedReducer(
        initialState,
        fetchProfileOrders.fulfilled([mockOrder], '')
      );

      expect(state).toEqual({
        ...initialState,
        profileOrders: [mockOrder],
        loading: false
      });
    });

    it('Обработка rejected', () => {
      const error = 'Failed to fetch profile orders';
      const state = feedReducer(
        initialState,
        fetchProfileOrders.rejected(new Error(error), '', undefined, error)
      );

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: error
      });
    });
  });
});
