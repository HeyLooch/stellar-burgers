import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderByNumber,
  getOrderByNumberSelector,
  getOrderRequest
} from '../../services/slices/orderSlice';
import { useLocation } from 'react-router-dom';
import {
  fetchIngredients,
  getIngredients
} from '../../services/slices/ingredientsSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const location = useLocation();
  const orderRequest = useSelector(getOrderRequest);
  const id = Number(location.pathname.split('/').pop());
  const orderData = useSelector(getOrderByNumberSelector) as TOrder;
  const ingredients: TIngredient[] = useSelector(getIngredients) || [];
  useEffect(() => {
    dispatch(getOrderByNumber(id));
  }, [dispatch, id]);
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [ingredients]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || !orderData.ingredients)
      return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || orderRequest) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
