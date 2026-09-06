import { type FC, type ReactNode, useEffect } from 'react';
import styles from './modal.module.css';

type TModalProps = {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
};

export const Modal: FC<TModalProps> = ({ children, onClose, className }) => {
  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
