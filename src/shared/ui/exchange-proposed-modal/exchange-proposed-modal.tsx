import type { FC } from 'react';
import { Modal } from '../modal/modal.tsx';
import { Button } from '../button';
import bellIcon from '../../../../public/icons/notification.svg';
import styles from './exchange-proposed-modal.module.css';

export type TExchangeProposedModalProps = {
  onClose: () => void;
};

export const ExchangeProposedModal: FC<TExchangeProposedModalProps> = ({
  onClose
}) => (
  <Modal onClose={onClose} className={styles.modalOverride}>
    <div className={styles.content}>
      <img src={bellIcon} alt='' className={styles.icon} />

      <h3 className={`h3 ${styles.title}`}>Вы предложили обмен</h3>
      <p className={`body ${styles.description}`}>
        Теперь дождитесь подтверждения. Вам придёт уведомление
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
