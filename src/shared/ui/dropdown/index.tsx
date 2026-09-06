import { useEffect, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import styles from './dropdown.module.css';

type TDropdownProps = {
  isOpen: boolean;
  children: ReactNode;
  onClose?: () => void;
};

export const Dropdown: FC<TDropdownProps> = ({ isOpen, children, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        onClose &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      {children}
    </div>
  );
};
