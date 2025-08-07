import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getProfileOrders } from '@selectors';
import { fetchProfileOrders } from '../../services/slices/feed/feedSlice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getProfileOrders);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  return (
    <>
      <ProfileOrdersUI orders={orders} />
    </>
  );
};
