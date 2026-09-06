import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '../../shared/ui/silly-components/app-header/app-header.tsx';
import { SkillsDropdownContainer } from '../skills-dropdown/skills-dropdown.tsx';
import { NotificationsDropdown } from '../../shared/ui/noification-dropdown/noification-dropdown.tsx';
import { logout } from '../../slices/authSlice.ts';
import { resetProfile } from '../../slices/profileSlice.ts';
import { getRequestsThunk } from '../../slices/requestSlice.ts';
import { markAllRead, clearRead } from '../../slices/notificationSlice.ts';
import { deriveNotifications } from '../../entites/notification/lib/deriveNotification.ts';
import type { TNotification } from '../../entites/notification/model/types.ts';
import type { AppDispatch, RootState } from '../../services/store.ts';
import { setSearch } from '../../slices/filterSlice.ts';

export const AppHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const authEmail = useSelector((state: RootState) => state.auth.user?.email);
  const profile = useSelector((state: RootState) => state.profile);
  const searchValue = useSelector((state: RootState) => state.filter.search);
  const requests = useSelector((state: RootState) => state.request.items);
  const readIds = useSelector(
    (state: RootState) => state.notifications.readIds
  );
  const dismissedIds = useSelector(
    (state: RootState) => state.notifications.dismissedIds
  );

  const isAuthenticated = Boolean(token);
  const userName = profile.name || authEmail || '';
  const userAvatar = profile.avatar;

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    dispatch(getRequestsThunk());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allNotifications = deriveNotifications(
    requests,
    profile.cardId ?? null
  );
  const visibleNotifications = allNotifications.filter(
    (n) => !dismissedIds.includes(n.id)
  );
  const newNotifications = visibleNotifications.filter(
    (n) => !readIds.includes(n.id)
  );
  const readNotifications = visibleNotifications.filter((n) =>
    readIds.includes(n.id)
  );
  const hasUnreadNotifications = newNotifications.length > 0;

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
  };
  const handleToggleSkills = () => {
    setIsSkillsOpen((prev) => !prev);
  };
  const handleToggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
  };
  const handleToggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };
  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile');
  };
  const handleLogoutClick = () => {
    dispatch(logout());
    dispatch(resetProfile());
    localStorage.removeItem('skillo_auth_mock_db');
    localStorage.removeItem('skillo_profile');
    navigate('/login');
  };
  const handleMarkAllRead = () => {
    dispatch(markAllRead(newNotifications.map((n) => n.id)));
  };
  const handleClearRead = () => {
    dispatch(clearRead());
  };
  const handleNotificationClick = (notification: TNotification) => {
    dispatch(markAllRead([notification.id]));
    setIsNotificationsOpen(false);
    navigate(notification.actionRoute);
  };

  return (
    <div ref={headerRef}>
      <AppHeaderUI
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onToggleSkills={handleToggleSkills}
        isSkillsOpen={isSkillsOpen}
        isAuthenticated={isAuthenticated}
        userName={userName}
        userAvatar={userAvatar}
        isUserMenuOpen={isUserMenuOpen}
        onToggleUserMenu={handleToggleUserMenu}
        onProfileClick={handleProfileClick}
        onLogoutClick={handleLogoutClick}
        isNotificationsOpen={isNotificationsOpen}
        onToggleNotifications={handleToggleNotifications}
        hasUnreadNotifications={hasUnreadNotifications}
        notificationsDropdown={
          isNotificationsOpen ? (
            <NotificationsDropdown
              newNotifications={newNotifications}
              readNotifications={readNotifications}
              onMarkAllRead={handleMarkAllRead}
              onClearRead={handleClearRead}
              onNotificationClick={handleNotificationClick}
              onClose={() => setIsNotificationsOpen(false)}
            />
          ) : null
        }
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
      />
      <SkillsDropdownContainer
        isOpen={isSkillsOpen}
        onClose={() => setIsSkillsOpen(false)}
      />
    </div>
  );
};
