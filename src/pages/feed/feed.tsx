import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeedOrders, getOrdersFeed } from '../../services/slices/orderSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  getIngredients
} from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredients = useSelector(getIngredients);
  const ordersFeed = useSelector(getOrdersFeed);
  const orders: TOrder[] = ordersFeed || [];
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [ingredients.length]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedOrders());
  }, [dispatch]);

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
