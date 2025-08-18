import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import {
  fetchIngredients,
  getIngredients
} from '../../services/slices/ingredientsSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderRequest,
  getOwnOrders,
  getOwnOrdersSelector
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const orderRequest = useSelector(getOrderRequest);
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [ingredients.length]);

  useEffect(() => {
    dispatch(getOwnOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getOwnOrdersSelector) || [];

  if (!orders || orderRequest) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
