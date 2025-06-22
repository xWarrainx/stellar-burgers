import { RootState } from './rootReducer';

export const getConstructorItems = (state: RootState) => state.constructorItems;
export const getAllIngredients = (state: RootState) => state.ingredients.items;
export const getOrderDetails = (state: RootState) => state.order.order;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const getIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const getFeedOrders = (state: RootState) => state.feed.orders;
export const getUser = (state: RootState) => state.user.user;
export const getProfileOrders = (state: RootState) => state.feed.profileOrders;
export const getCurrentIngredient = (state: RootState) =>
  state.ingredients.currentIngredient;
