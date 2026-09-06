import { useDispatch, useSelector } from 'react-redux';
import { ToggleThemeButton } from '../theme-button';
import { toggleTheme } from '../../../slices/themeSlice.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';

export const ThemeToggle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.value);

  return (
    <ToggleThemeButton type={theme} onClick={() => dispatch(toggleTheme())} />
  );
};
