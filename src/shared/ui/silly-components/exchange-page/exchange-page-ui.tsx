import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { RequestCard } from '../../request-card/request-card.tsx';
import type { TRequest } from '../../../../entites/request/model/types.ts';
import styles from '../../../../pages/profile/profile.module.css';

type TExchangesPageUIProps = {
  exchanges: TRequest[];
  getMode: (request: TRequest) => 'inbox' | 'outbox';
  onStartProgress: (id: string) => void;
  onComplete: (id: string) => void;
};

export const ExchangesPageUI: FC<TExchangesPageUIProps> = ({
  exchanges,
  getMode,
  onStartProgress,
  onComplete
}) => (
  <div className={styles.page}>
    <div className={styles.mainContainer}>
      <aside className={styles.sidebar}>
        <nav className={styles.sideMenu}>
          <Link to='/requests' className={styles.sideItem}>
            Заявки
          </Link>
          <Link
            to='/exchanges'
            className={`${styles.sideItem} ${styles.sideItemActive}`}
          >
            Мои обмены
          </Link>
          <Link to='/favorites' className={styles.sideItem}>
            Избранное
          </Link>
          <Link to='/my-skills' className={styles.sideItem}>
            Мои навыки
          </Link>
          <Link to='/profile' className={styles.sideItem}>
            Личные данные
          </Link>
        </nav>
      </aside>

      <main className={styles.contentCard}>
        {exchanges.length === 0 && (
          <p className='body'>Пока нет активных обменов</p>
        )}

        <div className={styles.list}>
          {exchanges.map((exchange) => (
            <RequestCard
              key={exchange.id}
              request={exchange}
              mode={getMode(exchange)}
              onStartProgress={onStartProgress}
              onComplete={onComplete}
            />
          ))}
        </div>
      </main>
    </div>
  </div>
);
