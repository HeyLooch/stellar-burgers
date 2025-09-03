// store.test.ts
import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/orderSlice';

describe('проверка инициализации rootReducer', () => {
  const rootReducer = combineSlices(ingredientsSlice, userSlice, ordersSlice);

  test('возвращает корректное начальное состояние при UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: ingredientsSlice.getInitialState(),
      user: userSlice.getInitialState(),
      orders: ordersSlice.getInitialState()
    });
  });
});
