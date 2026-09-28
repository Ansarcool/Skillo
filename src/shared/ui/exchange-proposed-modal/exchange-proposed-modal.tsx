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
  <Modal onClose={onClose} className={styles.modalExchange}>
    <div className={styles.content}>
      <img src={bellIcon} alt='' className={styles.icon} />

      <div className={styles.textColumn}>
        <h2 className={`h2 ${styles.title}`}>Вы предложили обмен</h2>
        <p className={`body ${styles.description}`}>
          Теперь дождитесь подтверждения. Вам придёт уведомление
        </p>
      </div>

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
