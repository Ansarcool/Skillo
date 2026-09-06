import type { FC } from 'react';
import styles from './user-menu.module.css';
import type { TUserMenuProps } from './types.ts';

export const UserMenuUI: FC<TUserMenuProps> = ({
  isOpen,
  onProfileClick,
  onLogoutClick
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.menu}>
      <button
        type='button'
        className={`body ${styles.item}`}
        onClick={onProfileClick}
      >
        Личный кабинет
      </button>
      <button
        type='button'
        className={`body ${styles.item}`}
        onClick={onLogoutClick}
      >
        Выйти из аккаунта
        <span className={styles.icon}>⏻</span>
      </button>
    </div>
  );
};
