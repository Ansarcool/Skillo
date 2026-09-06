import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  toggleFavorite,
  getFavoritesThunk,
  type TFavoritesState
} from '../favoritesSlice';

describe('favoritesSlice', () => {
  const initialState: TFavoritesState = {
    isLoading: true,
    ids: []
  };
  describe('reducers', () => {
    it('toggleFavorite - должен убрать id из списка', () => {
      const state = favoritesReducer(
        { ...initialState, ids: [1, 2, 3] },
        toggleFavorite(2)
      );
      expect(state.ids).toEqual([1, 3]);
    });
  });
  describe('getFavorites', () => {
    it('getsFavorites.pending - должен установить loading: true и сбросить ошибку', () => {
      const state = favoritesReducer(
        { isLoading: false, error: 'старая ошибка', ids: [] },
        { type: getFavoritesThunk.pending.type }
      );
      expect(state.isLoading).toEqual(true);
      expect(state.error).toBeNull();
    });
    it('getFavorites.fulfilled - должен установить loading: false и записать ids в массив', () => {
      const payload = [1, 2, 3];
      const state = favoritesReducer(
        { ...initialState },
        { type: getFavoritesThunk.fulfilled.type, payload }
      );
      expect(state.isLoading).toEqual(false);
      expect(state.ids).toEqual(payload);
    });
    it('getFavoritesThunk.rejected - должен устанвить loading: false и записать ошибку', () => {
      const msg = 'Ошибка';
      const state = favoritesReducer(
        { ...initialState, isLoading: true },
        { type: getFavoritesThunk.rejected.type, error: { message: msg } }
      );
      expect(state.isLoading).toEqual(false);
      expect(state.error).toEqual(msg);
    });
    it('getFavoritesThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
      const msg = 'Ошибка загрузки';
      const state = favoritesReducer(
        { ...initialState, isLoading: true },
        { type: getFavoritesThunk.rejected.type, error: {} }
      );
      expect(state.isLoading).toEqual(false);
      expect(state.error).toEqual(msg);
    });
  });
});
