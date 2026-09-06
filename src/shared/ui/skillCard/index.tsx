import type { FC } from 'react';
import styles from './skill-card.module.css';
import { Button } from '../button';
import heart from '../../../../public/icons/like.svg';
import heartFilled from '../../../../public/icons/like-filled.svg';
import { tagColorByCategory } from '../../lib/tag-colors.ts';
import clockIcon from '../../../../public/icons/clock.svg';
import guestIcon from '../../../../public/icons/user-circle.svg';

export type TSkillTag = {
  id?: number;
  category:
    'business' | 'creative' | 'languages' | 'education' | 'home' | 'health';
  subcategoryId?: number;
  name: string;
  description?: string;
  images?: string[];
};

export type TSkillCardUIProps = {
  avatar: string;
  name: string;
  city: string;
  age: number;
  canTeach: TSkillTag[];
  wantsToLearn: TSkillTag[];
  isFavorite?: boolean;
  isRequestSent?: boolean;
  onToggleFavorite?: () => void;
  onDetailsClick?: () => void;
};

export const SkillCardUI: FC<TSkillCardUIProps> = ({
  avatar,
  name,
  city,
  age,
  canTeach,
  wantsToLearn,
  onToggleFavorite,
  onDetailsClick,
  isFavorite,
  isRequestSent
}) => {
  const safeCanTeach = Array.isArray(canTeach) ? canTeach : [];
  const safeWantsToLearn = Array.isArray(wantsToLearn) ? wantsToLearn : [];

  return (
    <div className={styles.skillCard}>
      <button
        className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
        onClick={onToggleFavorite}
      >
        <img src={isFavorite ? heartFilled : heart} alt='избранное' />
      </button>

      <div className={styles.userInfo}>
        <img
          src={avatar || guestIcon}
          alt={name}
          className={styles.avatar}
          loading='lazy'
        />
        <div>
          <h4 className={styles.userName}>{name}</h4>
          <p className={`caption ${styles.locationAge}`}>
            {city}, {age} года
          </p>
        </div>
      </div>

      <div className={styles.skillInfo}>
        <div className={styles.canTeach}>
          <h4>Может научить</h4>
          <div className={styles.tags}>
            {safeCanTeach.map((skill, index) => {
              const categoryKey = skill.category || 'business';
              return (
                <span
                  key={skill.id ?? index}
                  className={`caption ${styles.tag}`}
                  style={{
                    backgroundColor:
                      tagColorByCategory[categoryKey] ||
                      tagColorByCategory.business
                  }}
                >
                  {skill.name}
                </span>
              );
            })}
          </div>
        </div>

        <div className={styles.wantToLearn}>
          <h4>Хочет научиться</h4>
          <div className={styles.tags}>
            {safeWantsToLearn.slice(0, 2).map((skill, index) => {
              const categoryKey = skill.category || 'business';
              return (
                <span
                  key={skill.id ?? index}
                  className={`caption ${styles.tag}`}
                  style={{
                    backgroundColor:
                      tagColorByCategory[categoryKey] ||
                      tagColorByCategory.business
                  }}
                >
                  {skill.name}
                </span>
              );
            })}
            {safeWantsToLearn.length > 2 && (
              <span
                className={`caption ${styles.tag}`}
                style={{ backgroundColor: 'var(--tag-plus)' }}
              >
                +{safeWantsToLearn.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <Button
        type={isRequestSent ? 'secondary' : 'primary'}
        onClick={onDetailsClick}
        className={`body ${styles.detailsButton}`}
      >
        {isRequestSent ? (
          <>
            <img src={clockIcon} alt='' className={styles.clockIcon} />
            Обмен предложен
          </>
        ) : (
          'Подробнее'
        )}
      </Button>
    </div>
  );
};
