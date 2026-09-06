import { describe, it, expect, vi } from 'vitest';
import badgeReducer, { unlockBadges, getUnlockedThunk } from '../badgeSlice';
import { BadgeId } from '../../entites/badge/model/types.ts';

type TBadgeState = {
  isLoading: boolean;
  unlockedIds: BadgeId[];
  error?: string | null;
};

describe('badgeSlice', () => {
  const initialState: TBadgeState = {
    isLoading: true,
    unlockedIds: [],
    error: null
  };

  describe('reducers', () => {
    it('unlockBadges - должен добавить новые бейджи без дубликатов и сохранить в localStorage', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const initialBadges = [BadgeId.FirstRequestSent, BadgeId.FirstFavorite];
      const payload = [BadgeId.FirstFavorite, BadgeId.SkillAdded];
      const expectedMerged = [
        BadgeId.FirstRequestSent,
        BadgeId.FirstFavorite,
        BadgeId.SkillAdded
      ];

      const state = badgeReducer(
        { ...initialState, unlockedIds: initialBadges },
        unlockBadges(payload)
      );

      expect(state.unlockedIds).toEqual(expectedMerged);
      expect(setItemSpy).toHaveBeenCalledWith(
        'skillo_unlocked_badges',
        JSON.stringify(expectedMerged)
      );

      setItemSpy.mockRestore();
    });
  });

  describe('extraReducers', () => {
    describe('getUnlockedThunk', () => {
      it('getUnlockedThunk.pending - должен установить isLoading: true и сбросить ошибку', () => {
        const state = badgeReducer(
          { ...initialState, isLoading: false, error: 'старая ошибка' },
          { type: getUnlockedThunk.pending.type }
        );

        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeNull();
      });

      it('getUnlockedThunk.fulfilled - должен установить isLoading: false и записать unlockedIds', () => {
        const payload = [BadgeId.FirstRequestSent, BadgeId.FirstFavorite];
        const state = badgeReducer(
          { ...initialState, isLoading: true },
          { type: getUnlockedThunk.fulfilled.type, payload }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.unlockedIds).toEqual(payload);
      });

      it('getUnlockedThunk.rejected - должен установить isLoading: false и записать ошибку', () => {
        const msg = 'Не удалось получить список бейджей';
        const state = badgeReducer(
          { ...initialState, isLoading: true },
          {
            type: getUnlockedThunk.rejected.type,
            error: { message: msg }
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });

      it('getUnlockedThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Не удалось получить список бейджей';
        const state = badgeReducer(
          { ...initialState, isLoading: true },
          {
            type: getUnlockedThunk.rejected.type,
            error: {}
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
  });
});
