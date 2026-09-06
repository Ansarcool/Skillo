import { describe, it, expect, vi, beforeEach } from 'vitest';
import notificationsReducer, {
  markAllRead,
  clearRead,
  getMarksIdsThunk,
  type TNotificationsState
} from '../notificationSlice';

describe('notificationSlice', () => {
  let initialState: TNotificationsState;

  beforeEach(() => {
    vi.restoreAllMocks();
    initialState = {
      readIds: [],
      dismissedIds: [],
      isLoading: false,
      error: null
    };
  });

  describe('reducers', () => {
    it('должен соединить payload и текущий массив и записать,записать все в localStorage', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      const startState: TNotificationsState = {
        ...initialState,
        readIds: ['4', '5', '6']
      };

      const action = markAllRead(['1', '2', '3']);
      const state = notificationsReducer(startState, action);

      const expectedMerged = ['4', '5', '6', '1', '2', '3'];
      expect(state.readIds).toEqual(expectedMerged);
      expect(setItemSpy).toHaveBeenCalledWith(
        'skillo_notifications_read',
        JSON.stringify(expectedMerged)
      );
    });

    it('должен перенести readIds в dismissedIds, очистить readIds и сохранить всё в localStorage', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      const startState: TNotificationsState = {
        ...initialState,
        readIds: ['1', '2'],
        dismissedIds: ['3', '4']
      };

      const state = notificationsReducer(startState, clearRead());
      const expectedDismissed = ['3', '4', '1', '2'];

      expect(state.readIds).toEqual([]);
      expect(state.dismissedIds).toEqual(expectedDismissed);

      expect(setItemSpy).toHaveBeenCalledWith(
        'skillo_notifications_dismissed',
        JSON.stringify(expectedDismissed)
      );
      expect(setItemSpy).toHaveBeenCalledWith(
        'skillo_notifications_read',
        JSON.stringify([])
      );
    });
  });

  describe('extra-reducers', () => {
    describe('getMarksIds', () => {
      it('getMarksIds.pending - должен установить loading: true и сбросить ошибку', () => {
        const startState: TNotificationsState = {
          ...initialState,
          error: 'Старая ошибка'
        };
        const state = notificationsReducer(
          startState,
          getMarksIdsThunk.pending('', undefined)
        );

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('getMarksIdsThunk.fulfilled - должен установить loading: false и записать данные', () => {
        const payload = { readIds: ['1', '2'], dismissedIds: ['3', '4'] };
        const state = notificationsReducer(
          initialState,
          getMarksIdsThunk.fulfilled(payload, '', undefined)
        );

        expect(state.isLoading).toBe(false);
        expect(state.readIds).toEqual(['1', '2']);
        expect(state.dismissedIds).toEqual(['3', '4']);
      });

      it('getMarksIdsThunk.rejected -должен установить isLoading: false и записать ошибку', () => {
        const msg = 'Ошибка сети';

        const state = notificationsReducer(initialState, {
          type: getMarksIdsThunk.rejected.type,
          error: { message: msg }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Ошибка сети');
      });

      it('getMarksIdsThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Не удалось загрузить маркеры';
        const state = notificationsReducer(initialState, {
          type: getMarksIdsThunk.rejected.type,
          error: { message: msg }
        });

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Не удалось загрузить маркеры');
      });
    });
  });
});
