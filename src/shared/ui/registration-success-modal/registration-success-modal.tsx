import type { FC } from 'react';
import { Modal } from '../modal/modal.tsx';
import { Button } from '../button';
import styles from './registration-success-modal.module.css';
import bellIcon from '../../../../public/icons/notification.svg';
export type TRegistrationSuccessModalProps = {
  onClose: () => void;
};

export const RegistrationSuccessModal: FC<TRegistrationSuccessModalProps> = ({
  onClose
}) => (
  <Modal onClose={onClose} className={styles.modalOverride}>
    <div className={styles.content}>
      <img className='iconCircle' src={bellIcon} alt='' />

      <h3 className={`h3 ${styles.title}`}>Ваше предложение создано</h3>
      <p className={`body ${styles.description}`}>
        Теперь вы можете предложить обмен
      </p>

      <Button
        type='primary'
        className={`body ${styles.button}`}
        onClick={onClose}
      >
        Готово
      </Button>
    </div>
  </Modal>
);
