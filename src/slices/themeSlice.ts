import { createSlice } from '@reduxjs/toolkit';

const THEME_STORAGE_KEY = 'skillo_theme';

export type TTheme = 'light' | 'dark';

const loadTheme = (): TTheme => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return 'light';
};

type TThemeState = {
  value: TTheme;
};

const initialState: TThemeState = {
  value: loadTheme()
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, state.value);
    },
    setTheme: (state, action: { payload: TTheme }) => {
      state.value = action.payload;
      localStorage.setItem(THEME_STORAGE_KEY, state.value);
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
