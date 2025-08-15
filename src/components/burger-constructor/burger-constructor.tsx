import { FC, SyntheticEvent, useEffect, useMemo, useRef } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  clearConstructor,
  getItemsConstructor,
  getItemsForOrder
} from '../../services/slices/ingredientsSlice';
import {
  getOrderRequest,
  orderBurger,
  getOrderModalData,
  resetOrderModalData,
  getFeedOrders
} from '../../services/slices/orderSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { getUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOrderDone = useRef(false);
  const user = useSelector(getUser);
  const itemsForOrder = useSelector(getItemsForOrder);
  const constructorItems = useSelector(getItemsConstructor);
  const orderModalData = useSelector(getOrderModalData);
  const orderRequest = useSelector(getOrderRequest);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (itemsForOrder) {
      dispatch(orderBurger(itemsForOrder as string[]));
      console.log('otpravka! ' + JSON.stringify(itemsForOrder));
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
    navigate('/feed');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
