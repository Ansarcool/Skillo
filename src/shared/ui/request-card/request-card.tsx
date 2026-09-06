import type { FC } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../services/store.ts';
import type {
  TRequest,
  TRequestStatus
} from '../../../entites/request/model/types.ts';
import { Button } from '../button';
import { generateIcsContent, downloadIcsFile } from '../../lib/ics.ts';
import styles from './request-card.module.css';

const statusLabels: Record<TRequestStatus, string> = {
  pending: 'Ожидает ответа',
  accepted: 'Принята',
  rejected: 'Отклонена',
  inProgress: 'В процессе',
  done: 'Завершена'
};

export type TRequestCardProps = {
  request: TRequest;
  mode: 'inbox' | 'outbox';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartProgress?: (id: string) => void;
  onComplete?: (id: string) => void;
};

export const RequestCard: FC<TRequestCardProps> = ({
  request,
  mode,
  onAccept,
  onReject,
  onStartProgress,
  onComplete
}) => {
  const skillCards = useSelector((state: RootState) => state.skills.skillCards);
  const fromCard = skillCards.find((c) => c.id === request.fromUserId);
  const otherUserName =
    mode === 'inbox' ? (fromCard?.name ?? '-') : request.toUserName;

  const canAddToCalendar =
    request.status === 'accepted' || request.status === 'inProgress';

  const handleAddToCalendar = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(10, 0, 0, 0);

    const participantA = mode === 'inbox' ? otherUserName : 'Вы';
    const participantB = mode === 'inbox' ? 'Вы' : otherUserName;

    const content = generateIcsContent({
      title: `Обмен: ${request.skillName}`,
      description: `Участники: ${participantA}, ${participantB}`,
      startDate,
      durationMinutes: 60
    });

    downloadIcsFile(`obmen-${request.skillName}.ics`, content);
  };

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <p className='body'>{request.skillName}</p>
        <p className={`body ${styles.name}`}>
          {mode === 'inbox' ? `От: ${otherUserName}` : `Кому: ${otherUserName}`}
        </p>
        <span className={`caption ${styles.status} ${styles[request.status]}`}>
          {statusLabels[request.status]}
        </span>
      </div>

      <div className={styles.actions}>
        {mode === 'inbox' && request.status === 'pending' && (
          <>
            <Button
              type='primary'
              className='body'
              onClick={() => onAccept?.(request.id)}
            >
              Принять
            </Button>
            <Button
              type='secondary'
              className='body'
              onClick={() => onReject?.(request.id)}
            >
              Отклонить
            </Button>
          </>
        )}

        {request.status === 'accepted' && (
          <Button
            type='primary'
            className='body'
            onClick={() => onStartProgress?.(request.id)}
          >
            Начать обмен
          </Button>
        )}

        {request.status === 'inProgress' && (
          <Button
            type='primary'
            className='body'
            onClick={() => onComplete?.(request.id)}
          >
            Завершить
          </Button>
        )}

        {canAddToCalendar && (
          <Button
            type='secondary'
            className='body'
            onClick={handleAddToCalendar}
          >
            Добавить в календарь
          </Button>
        )}
      </div>
    </div>
  );
};
