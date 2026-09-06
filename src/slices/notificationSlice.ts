import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import { getMarksIds } from '../api/api.ts';

const READ_STORAGE_KEY = 'skillo_notifications_read';
const DISMISSED_STORAGE_KEY = 'skillo_notifications_dismissed';

export const getMarksIdsThunk = createAsyncThunk<{
  readIds: string[];
  dismissedIds: string[];
}>('notifications/getMarksIds', async () => {
  const readIds = await getMarksIds(READ_STORAGE_KEY);
  const dismissedIds = getMarksIds(DISMISSED_STORAGE_KEY);

  return { readIds, dismissedIds };
});

const saveIds = (key: string, ids: string[]) => {
  localStorage.setItem(key, JSON.stringify(ids));
};

export type TNotificationsState = {
  readIds: string[];
  dismissedIds: string[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TNotificationsState = {
  readIds: [],
  dismissedIds: [],
  isLoading: false,
  error: null
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAllRead: (state, action: PayloadAction<string[]>) => {
      const merged = Array.from(new Set([...state.readIds, ...action.payload]));
      state.readIds = merged;
      saveIds(READ_STORAGE_KEY, merged);
    },
    clearRead: (state) => {
      const merged = Array.from(
        new Set([...state.dismissedIds, ...state.readIds])
      );
      state.dismissedIds = merged;
      state.readIds = [];
      saveIds(DISMISSED_STORAGE_KEY, merged);
      saveIds(READ_STORAGE_KEY, []);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMarksIdsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMarksIdsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.readIds = action.payload.readIds;
        state.dismissedIds = action.payload.dismissedIds;
      })
      .addCase(getMarksIdsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить маркеры';
      });
  }
});

export const { markAllRead, clearRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
