import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import { getFavorites } from '../api/api.ts';

export const getFavoritesThunk = createAsyncThunk<number[]>(
  'faviorites/getFavorites',
  () => getFavorites()
);
export type TFavoritesState = {
  isLoading: boolean;
  ids: number[];
  error?: string | null;
};

const initialState: TFavoritesState = {
  isLoading: true,
  ids: []
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((favId) => favId !== id);
      } else {
        state.ids.push(id);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFavoritesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFavoritesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ids = action.payload;
        state.error = null;
      })
      .addCase(getFavoritesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  }
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
