import ingredientsReducer, {
  fetchIngredients,
  setCurrentIngredient,
  clearCurrentIngredient
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

// Мокируем API с учетом реальной структуры ответов
jest.mock(
  '@api',
  () => ({
    getIngredientsApi: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          _id: '1',
          name: 'Ингредиент 1',
          type: 'bun',
          proteins: 80,
          fat: 24,
          carbohydrates: 53,
          calories: 420,
          price: 1255,
          image: 'https://code.s3.yandex.net/react/code/bun-02.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
        }
      ]
    })
  }),
  { virtual: true }
);

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    currentIngredient: null,
    loading: false,
    error: null
  };

  const mockIngredient: TIngredient = {
    _id: '1',
    name: 'Ингредиент 1',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const mockApiResponse = {
    success: true,
    data: [mockIngredient]
  };

  describe('Обработка синхронных экшенов', () => {
    it('Должен устанавливать текущий ингредиент', () => {
      const state = ingredientsReducer(
        initialState,
        setCurrentIngredient(mockIngredient)
      );
      expect(state.currentIngredient).toEqual(mockIngredient);
    });

    it('Должен убирать текущий ингредиент', () => {
      const stateWithIngredient = {
        ...initialState,
        currentIngredient: mockIngredient
      };
      const state = ingredientsReducer(
        stateWithIngredient,
        clearCurrentIngredient()
      );
      expect(state.currentIngredient).toBeNull();
    });
  });

  describe('Обработка асинхронного экшена fetchIngredients', () => {
    it('Обработка pending', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.pending('')
      );
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

      const state = ingredientsReducer(
        pendingState,
        fetchIngredients.fulfilled(mockApiResponse.data, '')
      );

      expect(state).toEqual({
        ...initialState,
        items: mockApiResponse.data,
        loading: false
      });
    });

    it('Обработка rejected', () => {
      const errorMessage = 'Ошибка загрузки';
      const pendingState = {
        ...initialState,
        loading: true
      };
      const state = ingredientsReducer(
        pendingState,
        fetchIngredients.rejected(new Error(), '', undefined, errorMessage)
      );
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
