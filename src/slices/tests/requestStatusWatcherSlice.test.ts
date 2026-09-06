import { describe, it, expect, vi } from 'vitest';
import requestStatusWatcherReducer, {
  markStatusesSeen,
  getSeenStatusesThunk,
  type TSeenStatuses
} from '../requestStatusWatcherSlice';

type TState = {
  isLoading: boolean;
  seenStatuses: TSeenStatuses;
  error?: string | null;
};

describe('requestStatusWatcherSlice', () => {
  const initialState: TState = {
    isLoading: true,
    seenStatuses: {},
    error: null
  };

  describe('reducers', () => {
    it('markStatusesSeen - должен объединить новые статусы с текущими и записать их в localStorage', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const initialSeen = { req1: 'pending' };
      const payload = { req2: 'accepted', req1: 'accepted' };
      const expectedMerged = { req1: 'accepted', req2: 'accepted' };

      const state = requestStatusWatcherReducer(
        { ...initialState, seenStatuses: initialSeen },
        markStatusesSeen(payload)
      );

      expect(state.seenStatuses).toEqual(expectedMerged);
      expect(setItemSpy).toHaveBeenCalledWith(
        'skillo_seen_request_statuses',
        JSON.stringify(expectedMerged)
      );

      setItemSpy.mockRestore();
    });
  });

  describe('extraReducers', () => {
    describe('getSeenStatusesThunk', () => {
      it('getSeenStatusesThunk.pending - должен установить isLoading: true и сбросить ошибку', () => {
        const state = requestStatusWatcherReducer(
          { ...initialState, isLoading: false, error: 'старая ошибка' },
          { type: getSeenStatusesThunk.pending.type }
        );

        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeNull();
      });

      it('getSeenStatusesThunk.fulfilled - должен установить isLoading: false и записать seenStatuses', () => {
        const payload: TSeenStatuses = { req1: 'accepted', req2: 'rejected' };
        const state = requestStatusWatcherReducer(
          { ...initialState, isLoading: true },
          { type: getSeenStatusesThunk.fulfilled.type, payload }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.seenStatuses).toEqual(payload);
      });

      it('getSeenStatusesThunk.rejected - должен установить isLoading: false и записать ошибку', () => {
        const msg = 'Не удалось получить статусы просмотров';
        const state = requestStatusWatcherReducer(
          { ...initialState, isLoading: true },
          {
            type: getSeenStatusesThunk.rejected.type,
            error: { message: msg }
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });

      it('getSeenStatusesThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Не удалось получить статусы просмотров';
        const state = requestStatusWatcherReducer(
          { ...initialState, isLoading: true },
          {
            type: getSeenStatusesThunk.rejected.type,
            error: {}
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
  });
});
