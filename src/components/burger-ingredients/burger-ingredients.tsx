import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const { items: ingredients } = useSelector((state) => state.ingredients);
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.constructorItems
  );

  // Функция для подсчета количества ингредиентов
  const getIngredientCount = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      return bun?._id === ingredient._id ? 2 : 0;
    }
    return constructorIngredients.filter((item) => item._id === ingredient._id)
      .length;
  };

  // Фильтруем ингредиенты по категориям с добавлением count
  const buns = ingredients
    .filter((item) => item.type === 'bun')
    .map((item) => ({ ...item, count: getIngredientCount(item) }));

  const mains = ingredients
    .filter((item) => item.type === 'main')
    .map((item) => ({ ...item, count: getIngredientCount(item) }));

  const sauces = ingredients
    .filter((item) => item.type === 'sauce')
    .map((item) => ({ ...item, count: getIngredientCount(item) }));

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
