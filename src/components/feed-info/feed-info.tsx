import { FC } from 'react';
import { useSelector } from '../../services/store'; // Добавляем useSelector
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из store
  const { orders, total, totalToday } = useSelector((state) => ({
    orders: state.feed.orders,
    total: state.feed.total,
    totalToday: state.feed.totalToday
  }));

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
