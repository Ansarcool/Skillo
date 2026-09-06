import type { FC, ReactNode } from 'react';
import styles from './skill-cards-section.module.css';

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
      <h2 className='h2'>{title}</h2>
      <button className={styles.showAll} onClick={onShowAllClick}>
        Смотреть все →
      </button>
    </div>
    <div className={styles.cardsGrid}>{children}</div>
  </section>
);
