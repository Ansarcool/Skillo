import type { FC } from 'react';
import styles from './app-header.module.css';
import type { TAppHeaderUIProps } from './types.ts';
import { Link } from 'react-router-dom';
import { SearchInput } from '../../search-input';
import { Button } from '../../button';
import { UserMenuUI } from '../../user-menu';
import { MobileMenu } from '../../mobile-menu/mobile-menu.tsx';
import '../../../styles/fonts.css';

import logoIcon from '../../../../../public/icons/Logo.png';
import arrowIcon from '../../../../../public/icons/chevron-down.png';
import bellIcon from '../../../../../public/icons/notification.svg';
import heartIcon from '../../../../../public/icons/like.svg';
import guestIcon from '../../../../../public/icons/user-circle.svg';
import { ThemeToggle } from '../../theme-container/theme-container.tsx';
import burgerIcon from '../../../../../public/icons/burger-menu.png';
import closeIcon from '../../../../../public/icons/cross.svg';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  searchValue,
  onSearchChange,
  onToggleSkills,
  isAuthenticated,
  userName,
  userAvatar,
  isUserMenuOpen,
  onToggleUserMenu,
  onProfileClick,
  onLogoutClick,
  onToggleNotifications,
  hasUnreadNotifications,
  notificationsDropdown,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => (
  <header className={styles.header}>
    <nav className={styles.appHeader}>
      <div className={styles.leftSection}>
        <Link to='/' className={styles.logoLink}>
          <div className={styles.logo}>
            <img src={logoIcon} alt='logo' />
          </div>
        </Link>

        <div className={styles.menuGroup}>
          <Link to='/about' className={`${styles.aboutLink} body`}>
            <p>О проекте</p>
          </Link>
          <div
            className={`${styles.skillsTrigger} body`}
            onClick={onToggleSkills}
          >
            <span>Все навыки</span>
            <img src={arrowIcon} alt='стрелка-вниз' className={styles.arrow} />
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>

        {isAuthenticated ? (
          <>
            <div className={styles.iconsGroup}>
              <div className={styles.iconButton}>
                <ThemeToggle />
              </div>
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
              >
                <img src={heartIcon} alt='' />
              </Link>
            </div>

            <div className={styles.userWrapper}>
              <button
                className={`body ${styles.userLink}`}
                onClick={onToggleUserMenu}
              >
                <span>{userName}</span>
                <img
                  src={userAvatar || guestIcon}
                  alt={userName}
                  className={styles.userAvatar}
                />
              </button>

              <UserMenuUI
                isOpen={isUserMenuOpen}
                onProfileClick={onProfileClick}
                onLogoutClick={onLogoutClick}
              />
            </div>

            {notificationsDropdown}
          </>
        ) : (
          <>
            <div className={styles.iconButton}>
              <ThemeToggle />
            </div>
            <div className={styles.authButtons}>
              <Button
                type='secondary'
                size='small'
                to='/login'
                className='body'
              >
                Войти
              </Button>
              <Button
                type='primary'
                size='small'
                to='/register'
                className='body'
              >
                Зарегистрироваться
              </Button>
            </div>
          </>
        )}
      </div>

      <button className={styles.burgerButton} onClick={onToggleMobileMenu}>
        <img
          className={styles.burgerIcon}
          src={isMobileMenuOpen ? closeIcon : burgerIcon}
          alt='Меню'
        />
      </button>
    </nav>

    <MobileMenu
      isOpen={isMobileMenuOpen}
      onClose={onToggleMobileMenu}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onToggleSkills={onToggleSkills}
      isAuthenticated={isAuthenticated}
      userName={userName}
      userAvatar={userAvatar}
      hasUnreadNotifications={hasUnreadNotifications}
      onToggleNotifications={onToggleNotifications}
      onProfileClick={onProfileClick}
      onLogoutClick={onLogoutClick}
      notificationsDropdown={notificationsDropdown}
    />
  </header>
);
