import type { ReactNode } from 'react';

export type TMobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleSkills: () => void;
  isAuthenticated: boolean;
  userName: string;
  userAvatar: string | null;
  hasUnreadNotifications: boolean;
  onToggleNotifications: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  notificationsDropdown: ReactNode;
};
