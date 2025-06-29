import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeedOrders } from '@selectors';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getFeedOrders);

  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Функция для обновления данных
  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
