import type { FC } from 'react';
import type { TNotification } from '../../../entites/notification/model/types.ts';
import bulbIcon from '../../../../public/icons/idea.svg';
import styles from './noification-dropdown.module.css';

export type TNotificationsDropdownProps = {
  newNotifications: TNotification[];
  readNotifications: TNotification[];
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onNotificationClick: (notification: TNotification) => void;
  onClose: () => void;
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return 'сегодня';

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'вчера';

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

export const NotificationsDropdown: FC<TNotificationsDropdownProps> = ({
  newNotifications,
  readNotifications,
  onMarkAllRead,
  onClearRead,
  onNotificationClick,
  onClose
}) => (
  <>
    <div className={styles.mobileOverlay} onClick={onClose} />
    <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className='h3'>Новые уведомления</h3>
          {newNotifications.length > 0 && (
            <button
              className={`caption ${styles.sectionAction}`}
              onClick={onMarkAllRead}
            >
              Прочитать все
            </button>
          )}
        </div>

        {newNotifications.length === 0 && (
          <p className={`caption ${styles.empty}`}>Новых уведомлений нет</p>
        )}

        {newNotifications.map((n) => (
          <div key={n.id} className={styles.item}>
            <div className={styles.itemRow}>
              <img src={bulbIcon} alt='' className={styles.icon} />
              <div className={styles.itemText}>
                <p className='body'>{n.title}</p>
                <p className={`caption ${styles.subtitle}`}>{n.subtitle}</p>
              </div>
              <span className={`caption ${styles.date}`}>
                {formatDate(n.date)}
              </span>
            </div>
            <button
              className={`body ${styles.goButton}`}
              onClick={() => onNotificationClick(n)}
            >
              Перейти
            </button>
          </div>
        ))}
      </div>

      {readNotifications.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className='h3'>Просмотренные</h3>
            <button
              className={`caption ${styles.sectionAction}`}
              onClick={onClearRead}
            >
              Очистить
            </button>
          </div>

          {readNotifications.map((n) => (
            <div key={n.id} className={`${styles.item} ${styles.itemRead}`}>
              <div className={styles.itemRow}>
                <img src={bulbIcon} alt='' className={styles.icon} />
                <div className={styles.itemText}>
                  <p className='body'>{n.title}</p>
                  <p className={`caption ${styles.subtitle}`}>{n.subtitle}</p>
                </div>
                <span className={`caption ${styles.date}`}>
                  {formatDate(n.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
);
