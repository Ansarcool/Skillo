import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import {
  createRequest,
  getRequests,
  type TCreateRequestData,
  updateRequestStatus
} from '../api/api.ts';
import type {
  TRequest,
  TRequestStatus
} from '../entites/request/model/types.ts';

export type TRequestsState = {
  items: TRequest[];
  isLoading: boolean;
  error: string | undefined;
};

const initialState: TRequestsState = {
  items: [],
  isLoading: false,
  error: undefined
};

export const getRequestsThunk = createAsyncThunk('requests/getAll', () =>
  getRequests()
);

export const createRequestThunk = createAsyncThunk(
  'requests/create',
  (data: TCreateRequestData) => createRequest(data)
);

export const updateRequestStatusThunk = createAsyncThunk(
  'requests/updateStatus',
  ({ id, status }: { id: string; status: TRequestStatus }) =>
    updateRequestStatus(id, status)
);

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRequestsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        getRequestsThunk.fulfilled,
        (state, action: PayloadAction<TRequest[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(getRequestsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заявки';
      })
      .addCase(createRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(createRequestThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось создать заявку';
      })
      .addCase(updateRequestStatusThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(
        updateRequestStatusThunk.fulfilled,
        (state, action: PayloadAction<TRequest>) => {
          state.isLoading = false;
          const index = state.items.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      )
      .addCase(updateRequestStatusThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось обновить статус заявки';
      });
  }
});

export default requestsSlice.reducer;
