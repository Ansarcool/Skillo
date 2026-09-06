import { describe, it, expect } from 'vitest';
import skillReducer, {
  getSkillsThunk,
  getSkillCardsThunk,
  type TSkillsState,
  type TSkillCategory
} from '../skillsSlice.ts';
import type { TSkillCard } from '../../api/api.ts';

describe('SkillsSlice', () => {
  const initialState: TSkillsState = {
    skills: [],
    skillCards: [],
    isLoading: false,
    error: null
  };

  const mockSkills: TSkillCategory[] = [
    {
      id: 5,
      category: 'Спорт',
      icon: 'sport-icon.png',
      skills: [
        {
          id: 3,
          name: 'Плавание'
        }
      ]
    }
  ];
  const mockSkillCards: TSkillCard[] = [
    {
      id: 5,
      name: 'Иван',
      avatar: 'avatar.png',
      city: 'Роттердам',
      age: 28,
      gender: `male`,
      bio: 'i like sport',
      createdAt: '03.12.2026',
      likesCount: 67,
      canTeach: [],
      wantsToLearn: []
    }
  ];
  describe('getSkillsThunk', () => {
    it('getSkillsThunk.pending - должен установить loading: true и сбросить ошибку', () => {
      const state = skillReducer(
        { ...initialState, isLoading: false, error: 'старая ошибка' },
        { type: getSkillsThunk.pending.type }
      );
      expect(state.isLoading).toEqual(true);
      expect(state.error).toBeNull();
    });
    it('getSkillsThunk.fulfilled - должен установить looading: false и записать skils в массив', () => {
      const state = skillReducer(
        { ...initialState, isLoading: true },
        { type: getSkillsThunk.fulfilled.type, payload: mockSkills }
      );
      expect(state.isLoading).toEqual(false);
      expect(state.skills).toEqual(mockSkills);
    });
    it('getSkillsThunk.rejected - должен установить looading: false и записать ошибку', () => {
      const msg = 'Ошибка';
      const state = skillReducer(initialState, {
        type: getSkillsThunk.rejected.type,
        error: { message: msg }
      });

      expect(state.isLoading).toEqual(false);
      expect(state.error).toEqual(msg);
    });
    it('getSkillsThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
      const msg = 'Ошибка загрузки';
      const state = skillReducer(initialState, {
        type: getSkillsThunk.rejected.type,
        error: {}
      });

      expect(state.isLoading).toEqual(false);
      expect(state.error).toEqual(msg);
    });
  });
  describe('getSkillCardsThunk', () => {
    it('getSkillsCardsThunk.pending - должен установить loading: true и сбросить ошибку', () => {
      const state = skillReducer(
        { ...initialState, isLoading: false, error: 'старая ошибка' },
        { type: getSkillCardsThunk.pending.type }
      );
      expect(state.isLoading).toEqual(true);
      expect(state.error).toBeNull;
    });
    it('getSkillsCardsThunk.fulfilled - должен установить loading: false и загрузить карточки', () => {
      const state = skillReducer(
        { ...initialState, isLoading: true },
        { type: getSkillCardsThunk.fulfilled.type, payload: mockSkillCards }
      );
      expect(state.isLoading).toEqual(false);
      expect(state.skillCards).toEqual(mockSkillCards);
    });
    it('getSkillsCardsThunk.rejected - должен установить loading: false и записать ошибку', () => {
      const msg = 'Ошибка загрузки';
      const state = skillReducer(initialState, {
        type: getSkillCardsThunk.rejected.type,
        error: { message: msg }
      });
      expect(state.isLoading).toEqual(false);
      expect(state.error).toEqual(msg);
    });
    it('getSkillsCardsThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
      const msg = 'Ошибка';
      const state = skillReducer(initialState, {
        type: getSkillCardsThunk.rejected.type,
        error: {}
      });

      expect(state.isLoading).toEqual(false);
      expect(state.error).toEqual(msg);
    });
  });
});
