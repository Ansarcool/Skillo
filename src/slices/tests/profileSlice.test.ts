import { describe, it, expect } from 'vitest';
import profileReducer, {
  setProfile,
  resetProfile,
  getProfileThunk,
  updateProfileThunk,
  type TProfileState
} from '../profileSlice.ts';
import { emptyProfile } from '../../api/api.ts';
type TProfileSliceState = TProfileState & {
  isLoading: boolean;
  error: string | null;
};
describe('profileSlice', () => {
  const initialState: TProfileSliceState = {
    ...emptyProfile,
    isLoading: false,
    error: null
  };

  describe('reducers', () => {
    it('устанавливает данные из сервера в профиль', () => {
      const payload: TProfileState = {
        name: 'Асанали',
        avatar: null,
        birthDate: '03.03.2003',
        gender: 'any',
        city: 'Роттердам',
        categoryId: 'Бизнес и карьера',
        subcategoryId: 'Личный бренд',
        cardId: null,
        canTeach: null,
        wantsToLearn: null
      };

      const state = profileReducer(initialState, setProfile(payload));

      expect(state).toEqual({
        ...initialState,
        ...payload
      });
    });
    it('очищает профиль', () => {
      const payload: TProfileState = {
        name: 'Асанали',
        avatar: null,
        birthDate: '03.03.2003',
        gender: 'any',
        city: 'Роттердам',
        categoryId: 'Бизнес и карьера',
        subcategoryId: 'Личный бренд',
        cardId: null,
        canTeach: null,
        wantsToLearn: null
      };
      const stateFilledProfile = profileReducer(
        initialState,
        setProfile(payload)
      );
      const state = profileReducer(stateFilledProfile, resetProfile());
      expect(state).toEqual(initialState);
    });
  });
  describe('extra-reducers', () => {
    describe('getProfileThunk', () => {
      it('getProfileThunk.pending - должен установить loading: true и сбросить ошибку', () => {
        const state = profileReducer(
          { ...initialState, isLoading: false, error: 'старая ошибка' },
          { type: getProfileThunk.pending.type }
        );

        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeNull();
      });
      it('getProfileThunk.fulfilled - должен установить loading: false и данные профиля', () => {
        const payload: TProfileState = {
          name: 'Асанали',
          avatar: null,
          birthDate: '03.03.2003',
          gender: 'any',
          city: 'Роттердам',
          categoryId: 'Бизнес и карьера',
          subcategoryId: 'Личный бренд',
          cardId: null,
          canTeach: null,
          wantsToLearn: null
        };

        const state = profileReducer(
          { ...initialState, isLoading: true },
          { type: getProfileThunk.fulfilled.type, payload }
        );
        expect(state).toEqual({
          ...initialState,
          ...payload,
          isLoading: false
        });
      });
      it('getProfileThunk.rejected - должен установить loading: false и записать ошибку', () => {
        const msg = 'Не удалось загрузить профиль';
        const state = profileReducer(
          { ...initialState, isLoading: true },
          {
            type: getProfileThunk.rejected.type,
            error: { message: msg }
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('getProfileThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Не удалось загрузить профиль';
        const state = profileReducer(
          { ...initialState, isLoading: true },
          {
            type: getProfileThunk.rejected.type,
            error: {}
          }
        );
        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
    describe('updateProfileThunk', () => {
      it('updateProfileThunk.pending - должен установить isLoading: true и сбросить ошибку', () => {
        const state = profileReducer(
          { ...initialState, isLoading: false, error: 'старая ошибка' },
          { type: updateProfileThunk.pending.type }
        );

        expect(state.isLoading).toEqual(true);
        expect(state.error).toBeNull();
      });

      it('updateProfileThunk.fulfilled - должен установить isLoading: false и обновить имя и город', () => {
        const payload = {
          email: 'test@example.com',
          name: 'Новое Имя',
          city: 'Новый Город'
        };

        const state = profileReducer(
          { ...initialState, isLoading: true },
          { type: updateProfileThunk.fulfilled.type, payload }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.name).toEqual('Новое Имя');
        expect(state.city).toEqual('Новый Город');
      });

      it('updateProfileThunk.rejected - должен установить isLoading: false и записать ошибку', () => {
        const msg = 'Ошибка обновления профиля';

        const state = profileReducer(
          { ...initialState, isLoading: true },
          {
            type: updateProfileThunk.rejected.type,
            error: { message: msg }
          }
        );

        expect(state.isLoading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
  });
});
