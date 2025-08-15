import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeedOrders, getOrdersFeed } from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedOrders());
  }, [dispatch]);
  const ordersFeed = useSelector(getOrdersFeed);
  const orders: TOrder[] = ordersFeed || [];

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedOrders());
      }}
    />
  );
};
