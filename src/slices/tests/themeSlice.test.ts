import { describe, it, expect, vi, beforeEach } from 'vitest';
import themeReducer, {
  toggleTheme,
  setTheme,
  type TTheme
} from '../themeSlice';

type TThemeState = {
  value: TTheme;
};

describe('themeSlice', () => {
  const initialState: TThemeState = {
    value: 'light'
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('reducers', () => {
    it('toggleTheme - должен переключать тему с light на dark и сохранять в localStorage', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      const state = themeReducer(initialState, toggleTheme());

      expect(state.value).toEqual('dark');
      expect(setItemSpy).toHaveBeenCalledWith('skillo_theme', 'dark');
    });

    it('toggleTheme - должен переключать тему с dark на light и сохранять в localStorage', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      const state = themeReducer({ value: 'dark' }, toggleTheme());

      expect(state.value).toEqual('light');
      expect(setItemSpy).toHaveBeenCalledWith('skillo_theme', 'light');
    });

    it('setTheme - должен устанавливать конкретную тему и сохранять в localStorage', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');

      const state = themeReducer(initialState, setTheme('dark'));

      expect(state.value).toEqual('dark');
      expect(setItemSpy).toHaveBeenCalledWith('skillo_theme', 'dark');
    });
  });
});
