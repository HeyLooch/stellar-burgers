import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { nanoid } from '@reduxjs/toolkit';

interface IOrderState {
  orders: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  orders: [],
  loading: false,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    isLoadingOrders: (state) => state.loading
  }
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(fetchIngredients.pending, (state) => {
  //         state.loading = true;
  //         state.error = null;
  //       })
  //       .addCase(fetchIngredients.rejected, (state, action) => {
  //         state.loading = false;
  //         state.error = action.error.message || 'Ошибка загрузки ингредиентов';
  //       })
  //       .addCase(fetchIngredients.fulfilled, (state, action) => {
  //         state.items = action.payload;
  //         state.loading = false;
  //         state.error = null;
  //       });
  //   }
});
// export const { addOrder } = ordersSlice.actions;

// export const { getOrders, isLoadingOrders } = ordersSlice.selectors;
