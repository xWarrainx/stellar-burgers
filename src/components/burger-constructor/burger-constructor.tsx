import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { TIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ingredients, bun } = useSelector((state) => state.constructorItems);
  const { loading: orderRequest, order: orderModalData } = useSelector(
    (state) => state.order
  );
  const isAuthenticated = useSelector((state) => state.user.isAuthChecked);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  return (
    <BurgerConstructorUI
      price={calculatePrice(bun, ingredients)}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

const calculatePrice = (
  bun: TIngredient | null,
  ingredients: TIngredient[]
): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum: number, item: TIngredient) => sum + item.price,
    0
  );
  return bunPrice + ingredientsPrice;
};
