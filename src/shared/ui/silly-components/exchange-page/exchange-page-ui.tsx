import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { RequestCard } from '../../request-card/request-card.tsx';
import type { TRequest } from '../../../../entites/request/model/types.ts';
import styles from '../favorites-page-ui/favorites-page.module.css';
import emailIcon from '../../../../../public/icons/request.svg';
import messageIcon from '../../../../../public/icons/message-text.svg';
import heartIcon from '../../../../../public/icons/like.svg';
import ideaIcon from '../../../../../public/icons/idea.svg';
import userIcon from '../../../../../public/icons/user.svg';

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
          <NavLink
            to='/requests'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={emailIcon} alt='' /> Заявки
          </NavLink>
          <NavLink
            to='/exchanges'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={messageIcon} alt='' /> Мои обмены
          </NavLink>
          <NavLink
            to='/favorites'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={heartIcon} alt='' /> Избранное
          </NavLink>
          <NavLink
            to='/my-skills'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={ideaIcon} alt='' /> Мои навыки
          </NavLink>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={userIcon} alt='' /> Личные данные
          </NavLink>
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
