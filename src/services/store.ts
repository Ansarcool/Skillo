import { configureStore, combineReducers } from '@reduxjs/toolkit';
import filterReducer from '../slices/filterSlice.ts';
import skillsReducer from '../slices/skillsSlice.ts';
import favoritesReducer from '../slices/favoritesSlice.ts';
import authReducer from '../slices/authSlice.ts';
import profileReducer from '../slices/profileSlice.ts';
import requestsReducer from '../slices/requestSlice.ts';
import notificationsReducer from '../slices/notificationSlice.ts';
import themeReducer from '../slices/themeSlice.ts';
import badgeReducer from '../slices/badgeSlice.ts';
import requestStatusWatcherReducer from '../slices/requestStatusWatcherSlice.ts';

export const rootReducer = combineReducers({
  filter: filterReducer,
  skills: skillsReducer,
  favorites: favoritesReducer,
  auth: authReducer,
  profile: profileReducer,
  request: requestsReducer,
  notifications: notificationsReducer,
  theme: themeReducer,
  badges: badgeReducer,
  requestStatusWatcher: requestStatusWatcherReducer
});

export const store = configureStore({
  reducer: rootReducer
});

store.subscribe(() => {
  const favorites = store.getState().favorites.ids;

  try {
    localStorage.setItem('skillo_favorites', JSON.stringify(favorites));
  } catch (e) {
    console.error('Не удалось сохранить избранное в localStorage:', e);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
