import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { SkillCardUI } from '../../skillCard';
import { PaginationUI } from '../../pagination/pagination.tsx';
import type { TSkillCard } from '../../../../api/api.ts';
import styles from './favorites-page.module.css';
import emailIcon from '../../../../../public/icons/request.svg';
import messageIcon from '../../../../../public/icons/message-text.svg';
import heartIcon from '../../../../../public/icons/like.svg';
import ideaIcon from '../../../../../public/icons/idea.svg';
import userIcon from '../../../../../public/icons/user.svg';

type TFavoritesPageUIProps = {
  favCards: TSkillCard[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleFavorite: (cardId: number) => void;
  onDetailsClick: (cardId: number) => void;
  isRequestSent: (card: TSkillCard) => boolean;
};

export const FavoritesPageUI: FC<TFavoritesPageUIProps> = ({
  favCards,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onToggleFavorite,
  onDetailsClick,
  isRequestSent
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
        {totalCount === 0 ? (
          <p className='body'>Пока нет избранных предложений</p>
        ) : (
          <>
            <div className={styles.list}>
              {favCards.map((card) => (
                <SkillCardUI
                  key={card.id}
                  avatar={card.avatar}
                  name={card.name}
                  city={card.city}
                  age={card.age}
                  isFavorite
                  canTeach={card.canTeach}
                  wantsToLearn={card.wantsToLearn}
                  onToggleFavorite={() => onToggleFavorite(card.id)}
                  onDetailsClick={() => onDetailsClick(card.id)}
                  isRequestSent={isRequestSent(card)}
                />
              ))}
            </div>

            <PaginationUI
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </>
        )}
      </main>
    </div>
  </div>
);
