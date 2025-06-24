import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '../../pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { OrderInfo, IngredientDetails, Modal } from '@components';
import { AppHeader } from '@components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';
import { Preloader } from '@ui';

// Компонент для защищенных маршрутов
export const ProtectedRoute = ({
  element,
  isPublic = false
}: {
  element: React.ReactElement;
  isPublic?: boolean;
}) => {
  const dispatch = useDispatch();
  const { user, isAuthChecked, loading } = useSelector(
    (state: RootState) => state.user
  );

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken && !user && !isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, user, isAuthChecked]);

  // Пока проверяем авторизацию
  //if ((!isAuthChecked || loading) && !isPublic) {
  //return <Preloader />;
  //}

  // Публичный маршрут или авторизованный пользователь
  if (isPublic || user) {
    return element;
  }

  // Перенаправляем на логин если не авторизованы
  return <Navigate to='/login' replace />;
};

export const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route
          path='/login'
          element={<ProtectedRoute element={<Login />} isPublic />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute element={<Register />} isPublic />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute element={<ForgotPassword />} isPublic />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute element={<ResetPassword />} isPublic />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='Детали заказа' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
