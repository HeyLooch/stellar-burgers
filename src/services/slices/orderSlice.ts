import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { clearConstructor } from './ingredientsSlice';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse
} from '@api';

interface IOrderState {
  ownOrders: TOrder[] | null;
  ordersFeed: TFeedsResponse | null;
  orderByNumber: TOrder | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
}

const initialState: IOrderState = {
  ownOrders: null,
  ordersFeed: null,
  orderByNumber: null,
  orderModalData: null,
  orderRequest: false,
  error: null
};

export const orderBurger = createAsyncThunk(
  'orders/post',
  async (data: string[], { dispatch }) => {
    const res = await orderBurgerApi(data);
    dispatch(clearConstructor());
    return res;
  }
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
    setOrderRequest: (state) => {
      state.orderRequest = true;
    },
    resetOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOwnOrdersSelector: (state) => state.ownOrders,
    getOrdersFeed: (state) => state.ordersFeed?.orders,
    getOrdersTotal: createSelector(
      (state: IOrderState) => state.ordersFeed,
      (ordersFeed) => ({
        total: ordersFeed?.total || 0,
        totalToday: ordersFeed?.totalToday || 0
      })
    ),
    getOrderByNumberSelector: createSelector(
      (state: IOrderState) => state.orderByNumber,
      (orderByNumber) => ({
        createdAt: orderByNumber?.createdAt || '',
        ingredients: orderByNumber?.ingredients || [],
        _id: orderByNumber?._id || '',
        status: orderByNumber?.status || '',
        name: orderByNumber?.name || '',
        updatedAt: orderByNumber?.updatedAt || '',
        number: orderByNumber?.number || 0
      })
    ),
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
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
        state.ordersFeed = action.payload;
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
      });
  }
});
export const { resetOrderModalData } = ordersSlice.actions;

export const {
  getOwnOrdersSelector,
  getOrdersFeed,
  getOrderByNumberSelector,
  getOrdersTotal,
  getOrderRequest,
  getOrderModalData
} = ordersSlice.selectors;
