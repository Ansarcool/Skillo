import type { FC } from 'react';
import { tagColorByCategory } from '../../../lib/tag-colors.ts';
import { categoryLabelBySlug } from '../../../lib/category-labels.ts';
import type { TSkillCard } from '../../../../api/api.ts';
import { Button } from '../../button';
import { SkillCardUI } from '../../skillCard';
import heartIcon from '../../../../../public/icons/like.svg';
import heartFilledIcon from '../../../../../public/icons/like-filled.svg';
import shareIcon from '../../../../../public/icons/share.svg';
import moreIcon from '../../../../../public/icons/more-square.svg';
import styles from './skill-detail.module.css';
import clockIcon from '../../../../../public/icons/clock.svg';

export type TSkillDetailPageUIProps = {
  card: TSkillCard;
  similarCards: TSkillCard[];
  favoriteIds: number[];
  activeImage: number;
  images: string[];
  onImageChange: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onToggleFavorite: (id: number) => void;
  onSimilarCardClick: (id: number) => void;
  onProposeExchange?: () => void;
  isRequestSent?: boolean;
  sentRequestCardIds?: number[];
};

export const SkillDetailPageUI: FC<TSkillDetailPageUIProps> = ({
  card,
  similarCards,
  favoriteIds,
  activeImage,
  images,
  onImageChange,
  onPrevImage,
  onNextImage,
  onToggleFavorite,
  onSimilarCardClick,
  onProposeExchange,
  isRequestSent,
  sentRequestCardIds = []
}) => {
  const mainSkill = card.canTeach[0];
  const isFavorite = favoriteIds.includes(card.id);
  const isSimilarCardRequestSent = (cardId: number) =>
    sentRequestCardIds.includes(cardId);

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <aside className={styles.sidebar}>
          <div className={styles.userHeader}>
            {card.avatar ? (
              <img
                src={card.avatar}
                alt={card.name}
                loading='lazy'
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
            <div>
              <h3>{card.name}</h3>
              <p className='caption'>
                {card.city}, {card.age} года
              </p>
            </div>
          </div>

          <p className={`body ${styles.description}`}>{card.bio}</p>

          <div className={styles.tagsBlock}>
            <h4>Может научить</h4>
            <div className={styles.tags}>
              {card.canTeach.map((skill, index) => (
                <span
                  key={skill.id ?? index}
                  className={`caption ${styles.tag}`}
                  style={{
                    backgroundColor: tagColorByCategory[skill.category]
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.tagsBlock}>
            <h4>Хочет научиться</h4>
            <div className={styles.tags}>
              {card.wantsToLearn.map((skill, index) => (
                <span
                  key={skill.id ?? index}
                  className={`caption ${styles.tag}`}
                  style={{
                    backgroundColor: tagColorByCategory[skill.category]
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.mainCard}>
          <div className={styles.mainActions}>
            <button
              className={styles.iconButton}
              onClick={() => onToggleFavorite(card.id)}
              aria-label='В избранное'
            >
              <img
                src={isFavorite ? heartFilledIcon : heartIcon}
                alt=''
                className={styles.iconImg}
              />
            </button>
            <button className={styles.iconButton} aria-label='Поделиться'>
              <img src={shareIcon} alt='' className={styles.iconImg} />
            </button>
            <button className={styles.iconButton} aria-label='Ещё'>
              <img src={moreIcon} alt='' className={styles.iconImg} />
            </button>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.infoColumn}>
              <h1 className='h1'>{mainSkill?.name}</h1>
              <p className='caption'>
                {mainSkill && categoryLabelBySlug[mainSkill.category]}
                {mainSkill?.name ? ` / ${mainSkill.name}` : ''}
              </p>
              <p className={`body ${styles.description}`}>
                {mainSkill?.description}
              </p>
              <Button
                type={isRequestSent ? 'secondary' : 'primary'}
                className={`body ${styles.proposeButton} ${isRequestSent ? styles.proposeButtonSent : ''}`}
                onClick={onProposeExchange}
                disabled={isRequestSent}
              >
                {isRequestSent ? (
                  <>
                    <img src={clockIcon} alt='' className={styles.clockIcon} />
                    Обмен предложен
                  </>
                ) : (
                  'Предложить обмен'
                )}
              </Button>
            </div>

            <div className={styles.galleryColumn}>
              <div className={styles.mainImageWrapper}>
                <button className={styles.carouselArrow} onClick={onPrevImage}>
                  ‹
                </button>
                <img
                  src={images[activeImage]}
                  alt=''
                  className={styles.mainImage}
                  loading='lazy'
                />
                <button className={styles.carouselArrow} onClick={onNextImage}>
                  ›
                </button>
              </div>

              <div className={styles.thumbnails}>
                {images.slice(0, 3).map((img, index) => (
                  <button
                    key={img}
                    className={styles.thumbnail}
                    onClick={() => onImageChange(index)}
                  >
                    <img src={img} alt='' loading='lazy' />
                    {index === 2 && images.length > 3 && (
                      <span className={styles.thumbnailOverlay}>
                        +{images.length - 3}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.similar}>
        <h2 className='h2'>Похожие предложения</h2>
        <div className={styles.similarGrid}>
          {similarCards.map((c) => (
            <SkillCardUI
              key={c.id}
              avatar={c.avatar}
              name={c.name}
              city={c.city}
              age={c.age}
              isFavorite={favoriteIds.includes(c.id)}
              onToggleFavorite={() => onToggleFavorite(c.id)}
              onDetailsClick={() => onSimilarCardClick(c.id)}
              canTeach={c.canTeach}
              wantsToLearn={c.wantsToLearn}
              isRequestSent={isSimilarCardRequestSent(c.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};
