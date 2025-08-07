import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const mockBun: TIngredient = {
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

  const mockMainIngredient: TIngredient = {
    _id: '2',
    name: 'Ингредиент 2',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('Обработка экшена добавления булки', () => {
    it('Должен добавлять булку', () => {
      const newState = constructorReducer(initialState, addBun(mockBun));
      expect(newState.bun).toEqual(mockBun);
      expect(newState.ingredients).toHaveLength(0);
    });

    it('Должен заменять добавленную булку', () => {
      const stateWithBun = { ...initialState, bun: mockBun };
      const newBun = { ...mockBun, _id: '3', name: 'Новая булка' };

      const newState = constructorReducer(stateWithBun, addBun(newBun));
      expect(newState.bun).toEqual(newBun);
    });
  });

  describe('Обработка экшена добавления ингредиента', () => {
    it('Должен добавлять ингредиент с уникальным id', () => {
      const action = addIngredient(mockMainIngredient);
      const newState = constructorReducer(initialState, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toMatchObject({
        ...mockMainIngredient,
        id: expect.any(String)
      });
    });
  });

  describe('Обработка экшена удаления ингредиента', () => {
    it('Должен удалять ингредиент по id', () => {
      const ingredientWithId: TConstructorIngredient = {
        ...mockMainIngredient,
        id: 'test-id'
      };
      const stateWithIngredient = {
        ...initialState,
        ingredients: [ingredientWithId]
      };

      const newState = constructorReducer(
        stateWithIngredient,
        removeIngredient('test-id')
      );

      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('Обработка экшена изменения порядка ингредиентов в начинке', () => {
    const ingredients: TConstructorIngredient[] = [
      { ...mockMainIngredient, id: '1' },
      { ...mockMainIngredient, id: '2' },
      { ...mockMainIngredient, id: '3' }
    ];

    it('Должен перемещать ингредиент с позиции 0 на позицию 2', () => {
      const state = { ...initialState, ingredients };
      const newState = constructorReducer(
        state,
        moveIngredient({ from: 0, to: 2 })
      );

      expect(newState.ingredients.map((i) => i.id)).toEqual(['2', '3', '1']);
    });

    it('Должен перемещать ингредиент с позиции 2 на позицию 0', () => {
      const state = { ...initialState, ingredients };
      const newState = constructorReducer(
        state,
        moveIngredient({ from: 2, to: 0 })
      );

      expect(newState.ingredients.map((i) => i.id)).toEqual(['3', '1', '2']);
    });

    it('Не должен изменять массив при одинаковых позициях', () => {
      const state = { ...initialState, ingredients };
      const newState = constructorReducer(
        state,
        moveIngredient({ from: 1, to: 1 })
      );

      expect(newState).toEqual(state);
    });
  });

  describe('Обработка экшена очистки конструктора ', () => {
    it('Должен очищать конструктор', () => {
      const state = {
        bun: mockBun,
        ingredients: [
          { ...mockMainIngredient, id: '1' },
          { ...mockMainIngredient, id: '2' }
        ]
      };

      const newState = constructorReducer(state, clearConstructor());
      expect(newState).toEqual(initialState);
    });
  });
});
