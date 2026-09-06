import React, {
  type FC,
  type PropsWithChildren,
  type SyntheticEvent
} from 'react';
import clsx from 'clsx';
import styles from './theme-button.module.css';

import moonIcon from '../../../../public/icons/moon.svg';
import sunIcon from '../../../../public/icons/light.png';
type ThemeButtonProps = PropsWithChildren<
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
> & {
  type?: 'light' | 'dark';
  onClick?: (() => void) | ((e: SyntheticEvent) => void);
  className?: string;
  htmlType?: 'button' | 'submit' | 'reset';
};

export const ToggleThemeButton: FC<ThemeButtonProps> = ({
  type = 'light',
  onClick,
  className,
  htmlType = 'button',
  ...restProps
}) => {
  const iconSrc = type === 'light' ? moonIcon : sunIcon;

  return (
    <button
      type={htmlType}
      onClick={onClick}
      className={clsx(styles['theme-button'], styles[type], className)}
      {...restProps}
    >
      <img src={iconSrc} alt='переключить тему' className={styles.icon} />
    </button>
  );
};
