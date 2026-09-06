import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { SearchInput } from '../search-input';
import { Button } from '../button';
import type { TMobileMenuProps } from './types.ts';
import bellIcon from '../../../../public/icons/notification.svg';
import heartIcon from '../../../../public/icons/like.svg';
import styles from './mobile-menu.module.css';
import { ThemeToggle } from '../theme-container/theme-container.tsx';
import guestIcon from '../../../../public/icons/user-circle.svg';

export const MobileMenu: FC<TMobileMenuProps> = ({
  isOpen,
  onClose,
  searchValue,
  onSearchChange,
  onToggleSkills,
  isAuthenticated,
  userName,
  userAvatar,
  hasUnreadNotifications,
  onToggleNotifications,
  onProfileClick,
  onLogoutClick,
  notificationsDropdown
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
          <div className={styles.searchContainer}>
            <SearchInput value={searchValue} onChange={onSearchChange} />
          </div>

          <nav className={styles.nav}>
            <Link
              to='/about'
              className={`body ${styles.navLink}`}
              onClick={onClose}
            >
              О проекте
            </Link>
            <div
              className={`body ${styles.navLink}`}
              onClick={() => {
                onToggleSkills();
                onClose();
              }}
            >
              Все навыки
            </div>
          </nav>

          {isAuthenticated ? (
            <>
              <div className={styles.iconsRow}>
                <ThemeToggle />
                <div className={styles.notificationsWrapper}>
                  <button
                    className={styles.iconButton}
                    onClick={onToggleNotifications}
                    aria-label='Уведомления'
                  >
                    <img src={bellIcon} alt='' />
                    {hasUnreadNotifications && (
                      <span className={styles.notificationsBadge} />
                    )}
                  </button>
                </div>
                <Link
                  to='/favorites'
                  className={styles.iconButton}
                  aria-label='Избранное'
                  onClick={onClose}
                >
                  <img src={heartIcon} alt='' />
                </Link>
              </div>

              <button
                className={`body ${styles.profileLink}`}
                onClick={() => {
                  onProfileClick();
                  onClose();
                }}
              >
                <span className={`body ${styles.name}`}>{userName}</span>
                <img
                  src={userAvatar ? userAvatar : guestIcon}
                  alt={userName}
                  loading='lazy'
                  className={styles.userAvatar}
                />
              </button>

              <button
                className={`body ${styles.logoutButton}`}
                onClick={() => {
                  onLogoutClick();
                  onClose();
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Button
                type='secondary'
                size='small'
                to='/login'
                className='body'
                onClick={onClose}
              >
                Войти
              </Button>
              <Button
                type='primary'
                size='small'
                to='/register'
                className='body'
                onClick={onClose}
              >
                Зарегистрироваться
              </Button>
            </div>
          )}
        </div>
      </div>

      {notificationsDropdown}
    </>
  );
};
