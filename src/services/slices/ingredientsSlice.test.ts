import {
  ingredientsSlice,
  addIngredient,
  removeIngredient,
  swapIngredients,
  initialState,
  fetchIngredients
} from './ingredientsSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: () => 'test-id'
  };
});

const bun: TIngredient = {
  _id: 'b1',
  name: 'Булка космическая',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'bun.png',
  image_mobile: 'bun-m.png',
  image_large: 'bun-l.png'
};
const sauce: TIngredient = {
  _id: 's1',
  name: 'Соус небулярный',
  type: 'sauce',
  proteins: 1,
  fat: 1,
  carbohydrates: 2,
  calories: 15,
  price: 20,
  image: 'sauce.png',
  image_mobile: 'sauce-m.png',
  image_large: 'sauce-l.png'
};
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  }
];
const sortedMockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('проверка слайса ingredientsSlice', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('проверка обработки синхронных экшенов', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test(`addIngredient добавляет булку в burgerConstructor.bun (не
      в burgerConstructor.ingredients)`, () => {
      const action = addIngredient(bun);
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state.burgerConstructor.bun).toEqual({ ...bun, id: 'test-id' });
      expect(state.burgerConstructor.ingredients).toHaveLength(0);
    });

    test(`addIngredient добавляет ингредиент (не-булку) с добавленным id в массив 
      ингредиентов`, () => {
      const state = ingredientsSlice.reducer(
        initialState,
        addIngredient(sauce)
      );

      expect(state.burgerConstructor.bun).toBeNull();
      expect(state.burgerConstructor.ingredients).toHaveLength(1);
      expect(state.burgerConstructor.ingredients[0]).toEqual({
        ...sauce,
        id: 'test-id'
      });
    });

    test(`removeIngredient удаляет ингредиент (не-булку) из массива`, () => {
      const stateWithSauce = ingredientsSlice.reducer(
        initialState,
        addIngredient(sauce)
      );

      expect(stateWithSauce.burgerConstructor.ingredients).toHaveLength(1);

      const stateAfterRemove = ingredientsSlice.reducer(
        stateWithSauce,
        removeIngredient(stateWithSauce.burgerConstructor.ingredients[0])
      );

      expect(stateAfterRemove.burgerConstructor.ingredients).toHaveLength(0);
    });

    test('swapIngredients меняет местами ингредиенты', () => {
      const stateAfterSwap = ingredientsSlice.reducer(
        {
          ...initialState,
          burgerConstructor: {
            bun,
            ingredients: mockIngredients as TConstructorIngredient[]
          }
        },
        swapIngredients({ from: 1, to: 0 })
      );

      expect(stateAfterSwap).toEqual({
        ...initialState,
        burgerConstructor: {
          bun,
          ingredients: sortedMockIngredients as TConstructorIngredient[]
        }
      });
    });
  });

  describe('проверка обработки асинхронных экшенов', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test(`fetchIngredients.pending обработка экшена начала запроса`, () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    test(`fetchIngredients.fullfiled обработка экшена успешного
      выполнения запроса`, () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: [sauce]
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: null,
        ingredients: [sauce]
      });
    });

    test(`fetchIngredients.rejected обработка экшена ошибки запроса`, () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка загрузки ингредиентов' }
      };
      const state = ingredientsSlice.reducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Ошибка загрузки ингредиентов'
      });
    });
  });
});
