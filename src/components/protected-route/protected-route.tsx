import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { getUser, getIsAuthChecked } from '../../services/slices/userSlice';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getIsAuthChecked);
  const location = useLocation();

  // пока идёт чекаут пользователя , показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  //  если маршрут для авторизованного пользователя, но пользователь неавторизован, то делаем редирект
  // в поле from объекта location.state записываем информацию о URL
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // если маршрут для неавторизованного пользователя, но пользователь авторизован
  // при обратном редиректе  получаем данные о месте назначения редиректа из объекта location.state
  // в случае если объекта location.state?.from нет — а такое может быть , если мы зашли на страницу логина по прямому URL
  // мы сами создаём объект c указанием адреса и делаем переадресацию на главную страницу
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
