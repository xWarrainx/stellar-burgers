import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getAllIngredients, getOrderDetails } from '@selectors';
import { useSelector } from '../../services/store';
import { useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const location = useLocation();
  const { order } = location.state || {};
  const ingredients = useSelector(getAllIngredients);

  // Готовим данные для отображения
  const orderInfo = useMemo(() => {
    if (order) {
      const date = new Date(order.createdAt);
      return {
        ...order,
        date
      };
    }

    const orderData = useSelector(getOrderDetails);
    if (!orderData || !ingredients.length) return null;
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
  }, [order, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
