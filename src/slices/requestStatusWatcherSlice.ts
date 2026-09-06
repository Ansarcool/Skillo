import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import { getSeenStatuses } from '../api/api.ts';

const SEEN_STATUSES_KEY = 'skillo_seen_request_statuses';

export type TSeenStatuses = Record<string, string>;

export const getSeenStatusesThunk = createAsyncThunk('getSeenStatuses', () =>
  getSeenStatuses()
);

const saveSeenStatuses = (statuses: TSeenStatuses) => {
  localStorage.setItem(SEEN_STATUSES_KEY, JSON.stringify(statuses));
};

type TState = {
  isLoading: boolean;
  seenStatuses: TSeenStatuses;
  error?: string | null;
};

const initialState: TState = {
  isLoading: true,
  seenStatuses: {},
  error: null
};

export const requestStatusWatcherSlice = createSlice({
  name: 'requestStatusWatcher',
  initialState,
  reducers: {
    markStatusesSeen: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      const merged = { ...state.seenStatuses, ...action.payload };
      state.seenStatuses = merged;
      saveSeenStatuses(merged);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSeenStatusesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSeenStatusesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.seenStatuses = action.payload;
      })
      .addCase(getSeenStatusesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось получить статусы просмотров';
      });
  }
});

export const { markStatusesSeen } = requestStatusWatcherSlice.actions;
export default requestStatusWatcherSlice.reducer;
