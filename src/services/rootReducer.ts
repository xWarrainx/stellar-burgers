import { combineReducers } from 'redux';
import ingredientsReducer from './slices/ingredients/ingredientsSlice';
import constructorReducer from './slices/constructor/constructorSlice';
import orderReducer from './slices/order/orderSlice';
import userReducer from './slices/user/userSlice';
import feedReducer from './slices/feed/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorItems: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer
});

export type RootState = ReturnType<typeof rootReducer>;
