import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  createOrder,
  clearOrder
} from '../../services/slices/order/orderSlice';
import { clearConstructor } from '../../services/slices/constructor/constructorSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { checkUserAuth } from '../../services/slices/user/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { ingredients, bun } = useSelector((state) => state.constructorItems);
  const { loading: orderRequest, order: orderModalData } = useSelector(
    (state) => state.order
  );
  const { isAuthChecked, user } = useSelector((state) => state.user);

  const onOrderClick = () => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth()).then(() => {
        if (!user) {
          navigate('/login', { state: { from: location } });
        }
      });
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      });
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
