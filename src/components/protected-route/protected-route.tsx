import { checkUserAuth } from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

export const ProtectedRoute = ({
  element,
  isPublic = false
}: {
  element: React.ReactElement;
  isPublic?: boolean;
}) => {
  const dispatch = useDispatch();
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут публичный и пользователь авторизован - перенаправляем в профиль
  if (isPublic && user) {
    return <Navigate to='/profile' replace />;
  }

  // Если маршрут защищенный и пользователь не авторизован - перенаправляем на логин
  if (!isPublic && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return element;
};
