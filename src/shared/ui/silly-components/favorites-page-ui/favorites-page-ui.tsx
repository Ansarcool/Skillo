import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { SkillCardUI } from '../../skillCard';
import { PaginationUI } from '../../pagination/pagination.tsx';
import type { TSkillCard } from '../../../../api/api.ts';
import styles from '../../../../pages/profile/profile.module.css';

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
          <Link to='/requests' className={styles.sideItem}>
            Заявки
          </Link>
          <Link to='/exchanges' className={styles.sideItem}>
            Мои обмены
          </Link>
          <Link
            to='/favorites'
            className={`${styles.sideItem} ${styles.sideItemActive}`}
          >
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
