// @ts-nocheck
/* eslint-disable */
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import {
  ProtectedRoute,
  AppHeader,
  Modal,
  IngredientDetails,
  OrderInfo
} from '@components';
import { useEffect } from 'react';
import { checkUserAuth } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const backgroundLocation  = location.state?.background;

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);
  
  const onCloseHandle = () => {
    navigate(-1);
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
                <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/ingredients/:id'
          element={<IngredientDetails />}
        />
        <Route
          path='/feed/:number'
          element={
            <OrderInfo />
          }
        />
      </Routes>
      
      {backgroundLocation && 
        <Routes>
          <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={onCloseHandle}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Modal title='' onClose={onCloseHandle}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title='' onClose={onCloseHandle}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />
        </Routes>
      }
    </div>
  );
};

export default App;
