import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import { BadgeId } from '../entites/badge/model/types.ts';
import { getUnlocked } from '../api/api.ts';

const UNLOCKED_STORAGE_KEY = 'skillo_unlocked_badges';

export const getUnlockedThunk = createAsyncThunk('getUnlocked', () =>
  getUnlocked()
);

const saveUnlocked = (ids: BadgeId[]) => {
  localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(ids));
};

type TBadgeState = {
  isLoading: boolean;
  unlockedIds: BadgeId[];
  error?: string | null;
};

const initialState: TBadgeState = {
  isLoading: true,
  unlockedIds: [],
  error: null
};

export const badgeSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    unlockBadges: (state, action: PayloadAction<BadgeId[]>) => {
      const merged = Array.from(
        new Set([...state.unlockedIds, ...action.payload])
      );
      state.unlockedIds = merged;
      saveUnlocked(merged);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUnlockedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUnlockedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unlockedIds = action.payload;
      })
      .addCase(getUnlockedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось получить список бейджей';
      });
  }
});

export const { unlockBadges } = badgeSlice.actions;
export default badgeSlice.reducer;
