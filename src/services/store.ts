import { configureStore, combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { ordersSlice } from './slices/orderSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(ingredientsSlice, userSlice, ordersSlice);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
