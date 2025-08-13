import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { getOrdersSelector } from '../../services/slices/orderSlice';
import { useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const ordersData = useSelector(getOrdersSelector);

  const orders: TOrder[] = ordersData!;

  if (!orders.length) {
    console.log(`Feed: orders `+JSON.stringify(orders));
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
