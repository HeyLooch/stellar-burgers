import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TIngredient, TConstructorIngredient } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse,
  TNewOrderResponse,
  TOrderResponse
} from '@api';
import { useDispatch } from '../store';
import { clearConstructor } from './ingredientsSlice';

interface IOrderState {
  ownOrders: TOrder[] | null;
  orders: TFeedsResponse | null;
  orderFeed: TFeedsResponse | null;
  orderByNumber: TOrder | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  // loading: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  ownOrders: null,
  orders: null,
  orderFeed: null,
  orderByNumber: null,
  orderModalData: null,
  orderRequest: false,
  // loading: false,
  error: null
};

export const orderBurger = createAsyncThunk(
  'orders/post',
  async (data: string[]) => orderBurgerApi(data)
);

export const getOwnOrders = createAsyncThunk('orders/getOwns', async () =>
  getOrdersApi()
);

export const getFeedOrders = createAsyncThunk('orders/getFeed', async () =>
  getFeedsApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
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
    getOwnOrdersSelector: (state) => state.ownOrders,
    getOrdersTotal: (state) => ({
      total: state.orderFeed?.total || 0,
      totalToday: state.orderFeed?.totalToday || 0
    }),
    getOrdersFeed: (state) => state.orderFeed?.orders,
    getOrderByNumberSelector: (state) => ({
      createdAt: state.orderByNumber?.createdAt || '',
      ingredients: state.orderByNumber?.ingredients || [],
      _id: state.orderByNumber?._id || '',
      status: state.orderByNumber?.status || '',
      name: state.orderByNumber?.name || '',
      updatedAt: state.orderByNumber?.updatedAt || '',
      number: state.orderByNumber?.number || 0
    }),
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
    // isLoadingOrders: (state) => state.loading
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
        state.orderModalData = action.payload.order;
        console.log(
          'fulfilled state.orderModalData = action.payload.order: ' +
            JSON.stringify(state.orderModalData)
        );
        state.error = null;
      })
      .addCase(getOwnOrders.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOwnOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message || 'Ошибка загрузки собственных заказов';
      })
      .addCase(getOwnOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.ownOrders = action.payload;
        console.log(
          'fulfilled state.ownOrders = action.payload: ' +
            JSON.stringify(state.orders)
        );
        state.error = null;
      })
      .addCase(getFeedOrders.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      })
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderFeed = action.payload;
        // console.log(
        //   'fulfilled state.orderFeed = action.payload ' + JSON.stringify(action.payload)
        // );
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message || 'Ошибка получения заказа по номеру';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderByNumber = {
          createdAt: action.payload?.orders[0].createdAt || '',
          ingredients: action.payload?.orders[0].ingredients || [],
          _id: action.payload?.orders[0]._id || '',
          status: action.payload?.orders[0].status || '',
          name: action.payload?.orders[0].name || '',
          updatedAt: action.payload?.orders[0].updatedAt || '',
          number: action.payload?.orders[0].number || 0
        };
        console.log(
          'fulfilled getOrderByNumber - action.payload.orders' +
            JSON.stringify(action.payload.orders)
        );
      });
  }
});
export const { resetOrderModalData } = ordersSlice.actions;

export const {
  getOrdersSelector,
  getOwnOrdersSelector,
  getOrdersFeed,
  getOrderByNumberSelector,
  getOrdersTotal,
  getOrderRequest,
  getOrderModalData
  // isLoadingOrders,
} = ordersSlice.selectors;
