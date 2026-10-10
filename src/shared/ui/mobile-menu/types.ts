import type { ReactNode, MouseEvent } from 'react';

export type TMobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleSkills: (e: MouseEvent<HTMLElement>) => void;
  isAuthenticated: boolean;
  userName: string;
  userAvatar: string | null;
  hasUnreadNotifications: boolean;
  onToggleNotifications: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  notificationsDropdown: ReactNode;
};
