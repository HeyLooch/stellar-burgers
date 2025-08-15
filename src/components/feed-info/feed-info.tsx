import { FC, useEffect } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedOrders,
  getOrdersFeed,
  getOrdersTotal
} from '../../services/slices/orderSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getFeedOrders());
  // }, [dispatch]);

  const OrdersData = useSelector(getOrdersFeed);
  const OrdersTotal = useSelector(getOrdersTotal);

  const orders: TOrder[] = OrdersData || [];
  const feed = OrdersTotal;

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');
  console.log(`readyOrders ` + readyOrders);
  console.log(`pendingOrders ` + pendingOrders);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
