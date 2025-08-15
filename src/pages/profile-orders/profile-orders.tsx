import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  getOrderRequest,
  getOwnOrders,
  getOwnOrdersSelector
} from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orderRequest = useSelector(getOrderRequest);

  useEffect(() => {
    dispatch(getOwnOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getOwnOrdersSelector) || [];

  if (!orders || orderRequest) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
