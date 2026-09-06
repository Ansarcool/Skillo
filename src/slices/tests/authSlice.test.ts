import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, {
  logout,
  registerThunk,
  getUserThunk
} from '../authSlice.ts';
import { loginThunk } from '../authSlice.ts';

describe('authSlice', () => {
  const initialState = {
    token: undefined,
    user: undefined,
    loading: false,
    error: undefined
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });
  describe('reducers', () => {
    it('logout должен очищать состояние и localStorage', () => {
      localStorage.setItem('accessToken', 'mock-token');

      const filledState = {
        token: 'mock-token',
        user: { email: 'test@test.com' },
        loading: false,
        error: undefined
      };
      const state = authReducer(filledState, logout());
      expect(state.user).toBeUndefined();
      expect(state.token).toBeUndefined();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });
  describe('extra-reducers', () => {
    describe('registerThunk', () => {
      it('registerThunk.pending - должен установить loading: true и очистить error', () => {
        const state = authReducer(
          { ...initialState, error: 'старая ошибка' },
          { type: registerThunk.pending.type }
        );

        expect(state.loading).toEqual(true);
        expect(state.error).toBeUndefined();
      });

      it('registerThunk.fullfilled - должен установить loading: false, записать user и token', () => {
        const payload = {
          token: 'new-token',
          user: { email: 'test@test.com' }
        };

        const state = authReducer(
          { ...initialState, loading: true },
          { type: registerThunk.fulfilled.type, payload }
        );
        expect(state.loading).toEqual(false);
        expect(state.user).toEqual(payload.user);
        expect(state.token).toEqual(payload.token);
        expect(localStorage.getItem('accessToken')).toEqual(payload.token);
      });
      it('registerThunk.rejected - должен установить loading: false и дать ошибку', () => {
        const msg = 'Некорректный email или пароль';
        const state = authReducer(
          { ...initialState, loading: false },
          { type: getUserThunk.rejected.type, error: { message: msg } }
        );

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('registerThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Ошибка регистрации';
        const state = authReducer(
          { ...initialState, loading: true },
          { type: registerThunk.rejected.type, error: {} }
        );

        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
    });
    describe('loginThunk', () => {
      it('loginThunk.pending - должен установить loading: true и очистить error', () => {
        const state = authReducer(
          { ...initialState, error: 'старая ошибка' },
          { type: loginThunk.pending.type }
        );

        expect(state.loading).toEqual(true);
        expect(state.error).toBeUndefined();
      });
      it('loginThunk.fullfilled - должен установить loading: false и записать token,user', () => {
        const payload = {
          token: 'new-token',
          user: { email: 'test@test.com' }
        };
        const state = authReducer(
          { ...initialState, loading: false },
          { type: loginThunk.fulfilled.type, payload }
        );
        expect(state.loading).toEqual(false);
        expect(state.user).toEqual(payload.user);
        expect(state.token).toEqual(payload.token);
        expect(localStorage.getItem('accessToken')).toEqual(payload.token);
      });
      it('loginThunk.rejected - должен установить loading: false и записать ошибку', () => {
        const msg = 'Не удалось получить данные пользователя';
        const state = authReducer(
          { ...initialState, loading: false },
          { type: getUserThunk.rejected.type, error: {} }
        );
        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('loginThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Ошибка входа';
        const state = authReducer(
          { ...initialState, loading: true },
          { type: getUserThunk.rejected.type, error: { message: msg } }
        );
        expect(state.error).toEqual(msg);
      });
    });
    describe('getUserThunk', () => {
      it('getUserThunk.pending - должен установить loading: true и очистить ошибку', () => {
        const state = authReducer(
          { ...initialState, loading: false, error: 'старая ошибка' },
          { type: getUserThunk.pending.type }
        );
        expect(state.loading).toEqual(true);
        expect(state.error).toBeUndefined();
      });
      it('getUserThunk.fulfilled – должен установить loading: false и записать user', () => {
        const user = { email: 'test@test.com' };

        const state = authReducer(
          { ...initialState, loading: true },
          { type: getUserThunk.fulfilled.type, payload: user }
        );

        expect(state.loading).toEqual(false);
        expect(state.user).toEqual(user);
      });
      it('getUserThunk.rejected - должен установить loading: false и записать ошибку', () => {
        const msg = 'Недействительный токен';
        const state = authReducer(
          { ...initialState, loading: true },
          { type: getUserThunk.rejected.type, error: { message: msg } }
        );
        expect(state.loading).toEqual(false);
        expect(state.error).toEqual(msg);
      });
      it('getUserThunk.rejected - должен использовать дефолтную ошибку, если error message пуст', () => {
        const msg = 'Не удалось получить данные пользователя';
        const state = authReducer(
          { ...initialState, loading: true },
          { type: getUserThunk.rejected.type, error: {} }
        );
        expect(state.loading).toEqual(false);
        expect(state.user).toBeNull();
        expect(state.error).toEqual(msg);
      });
    });
  });
});
