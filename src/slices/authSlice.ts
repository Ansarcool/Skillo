import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUser,
  login,
  register,
  type TRegisterUser,
  type TUser
} from '../api/api.ts';

type TAuthResponse = {
  user: TUser;
  token: string;
};

export const registerThunk = createAsyncThunk<TAuthResponse, TRegisterUser>(
  'auth/register',
  async (registerData) => await register(registerData)
);

export const loginThunk = createAsyncThunk<TAuthResponse, TRegisterUser>(
  'auth/login',
  async (loginData) => await login(loginData)
);

export const getUserThunk = createAsyncThunk<TUser, string>(
  'auth/user',
  async (token) => await getUser(token)
);

type AuthState = {
  token?: string;
  user?: TUser | null;
  loading: boolean;
  error?: string;
};

const loadTokenFromStorage = (): string | undefined => {
  try {
    return localStorage.getItem('accessToken') ?? undefined;
  } catch {
    return undefined;
  }
};

const initialState: AuthState = {
  token: loadTokenFromStorage(),
  loading: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.user = undefined;
      state.token = undefined;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })

      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error =
          action.error.message || 'Не удалось получить данные пользователя';
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
