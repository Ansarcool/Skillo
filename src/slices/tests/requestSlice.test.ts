import { describe, it, expect } from 'vitest';
import type { TRequestsState } from '../requestSlice.ts';
import requestReducer, {
  getRequestsThunk,
  createRequestThunk,
  updateRequestStatusThunk
} from '../requestSlice.ts';
import type { TRequest } from '../../entites/request/model/types.ts';

describe('requestSlice', () => {
  const initialState: TRequestsState = {
    items: [],
    isLoading: false,
    error: undefined
  };
  const mockRequest: TRequest = {
    id: '1',
    skillId: 3,
    skillName: 'Плавание',
    fromUserId: 4,
    toUserId: 7,
    toUserName: 'Иван',
    createdAt: '09.09.29',
    status: 'pending'
  };

  describe('extra-reducers', () => {
    describe('getRequestThunk', () => {
      it('getRequestThunk.pending - должен установить loading: true и сбросить ошибку', () => {
        const state = requestReducer(
          { ...initialState, isLoading: false },
          { type: getRequestsThunk.pending.type }
        );
        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeUndefined();
      });
      it('getRequestsThunk.fulfilled - должен установить isLoading: false и записать список заявок', () => {
        const payload: TRequest[] = [mockRequest];

        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: getRequestsThunk.fulfilled.type, payload }
        );

        expect(state.isLoading).toBe(false);
        expect(state.items).toEqual(payload);
      });
      it('getRequestThunk.rejected - должен установить loading: false и записать ошибку', () => {
        const msg = 'Не получилось загрузить заявки';
        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: createRequestThunk.rejected.type, error: { message: msg } }
        );
        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('getRequestThunk.rejected - должен установить loading: false и если нет msg-жа ошибки то поставить дефолтную', () => {
        const msg = 'Не удалось загрузить заявки';
        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: getRequestsThunk.rejected.type, error: {} }
        );
        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
    describe('createRequestThunk', () => {
      it('createRequestThunk.pending - должен устанновить loading: true и сбросить ошибку', () => {
        const state = requestReducer(
          { ...initialState, isLoading: false, error: 'старая ошибка' },
          { type: createRequestThunk.pending.type }
        );
        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeUndefined();
      });
      it('createRequestThunk.fulfilled - должен установить loading: false и создать запрос', () => {
        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: createRequestThunk.fulfilled.type, payload: mockRequest }
        );
        expect(state.isLoading).toEqual(false);
        expect(state.items).toEqual([mockRequest]);
      });
      it('createRequestThunk.rejected - должен установить loading: false и записать ошибку', () => {
        const msg = 'Не получилось создать заявку';
        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: createRequestThunk.rejected.type, error: { message: msg } }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('createRequestThunk.rejected - должен установить loading: false и если нет msg-жа ошибки то поставить дефолтную', () => {
        const msg = 'Не удалось создать заявку';
        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: createRequestThunk.rejected.type, error: {} }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
    describe('updateRequestStatusThunk', () => {
      it('updateRequestStatusThunk.pending - должен установить loading: true и сбросить ошибку', () => {
        const state = requestReducer(
          { ...initialState, isLoading: false, error: 'старая ошибка' },
          { type: updateRequestStatusThunk.pending.type }
        );

        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeUndefined();
      });
      it('updateRequestStatusThunk.fulfilled - должен установить loading: false обновить статус заявки по ее id', () => {
        const initialItems: TRequest[] = [
          mockRequest,
          { ...mockRequest, id: '2', status: 'pending' }
        ];
        const updatedRequest: TRequest = { ...mockRequest, status: 'accepted' };
        const state = requestReducer(
          { ...initialState, isLoading: true, items: initialItems },
          {
            type: updateRequestStatusThunk.fulfilled.type,
            payload: updatedRequest
          }
        );
        expect(state.isLoading).toEqual(false);
        expect(state.items[0].status).toEqual('accepted');
        expect(state.items[1].status).toEqual('pending');
      });
      it('updateRequestStatusThunk.rejected - должен установить loading: false и записать ошибку', () => {
        const msg = 'Не получилось обновить статус заявки';

        const state = requestReducer(
          { ...initialState, isLoading: true },
          {
            type: updateRequestStatusThunk.rejected.type,
            error: { message: msg }
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('updateRequestStatusThunk.rejected - должен установить loading: false и если нет msg-жа ошибки то поставить дефолтную', () => {
        const msg = 'Не удалось обновить статус заявки';
        const state = requestReducer(
          { ...initialState, isLoading: true },
          { type: updateRequestStatusThunk.rejected.type, error: {} }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
  });
});
