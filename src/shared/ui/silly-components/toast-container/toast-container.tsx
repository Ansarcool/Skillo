import type { FC } from 'react';
import { Toast, type TToastData } from '../../toast/toast.tsx';
import styles from './toast.module.css';

export type TToastContainerProps = {
  toasts: TToastData[];
  onDismiss: (id: string) => void;
};

export const ToastContainer: FC<TToastContainerProps> = ({
  toasts,
  onDismiss
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
