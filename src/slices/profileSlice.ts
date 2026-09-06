import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import {
  getProfile,
  emptyProfile,
  type TProfileState,
  type TUpdateProfileData,
  updateProfile
} from '../api/api.ts';

export type { TProfileState };

export type TProfileSliceState = TProfileState & {
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileSliceState = {
  ...emptyProfile,
  isLoading: false,
  error: null
};

export const getProfileThunk = createAsyncThunk<TProfileState>(
  'profile/get',
  async () => await getProfile()
);

export const updateProfileThunk = createAsyncThunk<
  TProfileState,
  TUpdateProfileData
>('profile/update', async (data) => {
  const saved = localStorage.getItem('skillo_auth_mock_db');
  const parsed = saved ? JSON.parse(saved) : null;

  return await updateProfile(data, parsed?.token || '');
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<TProfileState>) => {
      const updated = { ...state, ...action.payload };
      try {
        const { isLoading, error, ...cleanProfile } = updated;
        localStorage.setItem('skillo_profile', JSON.stringify(cleanProfile));
      } catch {}
      return updated;
    },
    resetProfile: (state) => ({ ...state, ...emptyProfile })
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.avatar = action.payload.avatar;
        state.name = action.payload.name;
        state.city = action.payload.city;
        state.birthDate = action.payload.birthDate;
        state.gender = action.payload.gender;
        state.description = action.payload.description ?? '';
        state.cardId = action.payload.cardId;
        state.canTeach = action.payload.canTeach;
        state.wantsToLearn = action.payload.wantsToLearn;
        state.categoryId = action.payload.categoryId;
        state.subcategoryId = action.payload.subcategoryId;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить профиль';
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.avatar = action.payload.avatar;
        state.birthDate = action.payload.birthDate;
        state.gender = action.payload.gender;
        state.city = action.payload.city;
        state.description = action.payload.description ?? '';
        state.categoryId = action.payload.categoryId;
        state.subcategoryId = action.payload.subcategoryId;
        state.cardId = action.payload.cardId;
        state.canTeach = action.payload.canTeach;
        state.wantsToLearn = action.payload.wantsToLearn;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления профиля';
      });
  }
});

export const { setProfile, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
