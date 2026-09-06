import type { ReactNode } from 'react';

export type TAppHeaderUIProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleSkills: () => void;
  isSkillsOpen: boolean;
  isAuthenticated: boolean;
  userName: string;
  userAvatar: string | null;
  isUserMenuOpen: boolean;
  onToggleUserMenu: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  isNotificationsOpen: boolean;
  onToggleNotifications: () => void;
  hasUnreadNotifications: boolean;
  notificationsDropdown: ReactNode;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
};
