import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TIngredient, TConstructorIngredient } from '@utils-types';
import {
  getIngredientsApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse,
  TNewOrderResponse
} from '@api';

interface IOrderState {
  order: TNewOrderResponse | null;
  orders: TFeedsResponse | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  order: null,
  orders: null,
  orderModalData: null,
  orderRequest: false,
  loading: false,
  error: null
};

export const orderBurger = createAsyncThunk(
  'orders/toOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const getBurgerOrders = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = true;
    },
    resetOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state.orders?.orders,
    getOrdersTotal: (state) => ({
      total: state.orders?.total || 0,
      totalToday: state.orders?.totalToday || 0
    }),
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    isLoadingOrders: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orders?.orders.push(action.payload.order);
        state.orderModalData = action.payload.order;
        console.log('state.orderModalData ' + JSON.stringify(state.orderModalData));
        console.log('state.orders ' + JSON.stringify(action.payload.order));
        state.orderRequest = false;
        state.error = null;
      })
      .addCase(getBurgerOrders.pending, (state) => {
        // state.orderRequest = true;
        state.error = null;
      })
      .addCase(getBurgerOrders.rejected, (state, action) => {
        // state.orderRequest = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      .addCase(getBurgerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        console.log('state.orders ' + JSON.stringify(state.orders));
        // state.orderRequest = false;
        state.error = null;
      });
  }
});
export const { resetOrderModalData } = ordersSlice.actions;

export const {
  getOrdersSelector,
  getOrdersTotal,
  isLoadingOrders,
  getOrderRequest,
  getOrderModalData
} = ordersSlice.selectors;
