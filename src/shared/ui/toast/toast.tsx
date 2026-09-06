import { type FC, useEffect } from 'react';
import styles from './toast.module.css';
import bellIcon from '.././../../assets/notification.svg';
export type TToastData = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type TToastProps = {
  toast: TToastData;
  onDismiss: (id: string) => void;
};

const AUTO_DISMISS_MS = 5000;
export const Toast: FC<TToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={styles.toast}>
      <img className={styles.icon} src={toast.icon || bellIcon} alt='' />

      <div className={styles.text}>
        <p className={`body ${styles.title}`}>{toast.title}</p>
        <p className={`caption ${styles.description}`}>{toast.description}</p>
      </div>
      <button
        className={styles.close}
        onClick={() => onDismiss(toast.id)}
        aria-label='Закрыть'
      >
        ✕
      </button>
    </div>
  );
};
