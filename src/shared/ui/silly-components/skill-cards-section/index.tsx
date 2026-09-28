import type { FC, ReactNode } from 'react';
import styles from './skill-cards-section.module.css';
import arrowRight from '../../../../../public/icons/chevron-right.svg';

type TSkillCardsSectionProps = {
  title: string;
  onShowAllClick?: () => void;
  children: ReactNode;
};

export const SkillCardsSection: FC<TSkillCardsSectionProps> = ({
  title,
  onShowAllClick,
  children
}) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h1 className='title'>{title}</h1>
      <button className={`body ${styles.showAll}`} onClick={onShowAllClick}>
        Смотреть все
        <img src={arrowRight} alt='' />
      </button>
    </div>
    <div className={styles.cardsGrid}>{children}</div>
  </section>
);
