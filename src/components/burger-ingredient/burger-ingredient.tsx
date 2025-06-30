import { FC, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { setCurrentIngredient } from '../../services/slices/ingredientsSlice';
import { addIngredient, addBun } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    const handleIngredientClick = () => {
      dispatch(setCurrentIngredient(ingredient));
      navigate(`/ingredients/${ingredient._id}`, {
        state: { backgroundLocation: location }
      });
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        onClick={handleIngredientClick}
      />
    );
  }
);
