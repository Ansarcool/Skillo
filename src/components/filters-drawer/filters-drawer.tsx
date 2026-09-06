import { useState } from 'react';
import { FiltersSidebar } from '../filters-sidebar/filters-sidebar.tsx';
import styles from './filters-drawer.module.css';
import filterIcon from '../../../public/icons/filter.png';
import closeIcon from '../../../public/icons/cross.svg';

export const FiltersDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        className={`body ${styles.trigger}`}
        onClick={() => setIsOpen(true)}
      >
        <img className={styles.icon} src={filterIcon} alt='' />
        Фильтры
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
        <div className={styles.panelHeader}>
          <button
            type='button'
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label='Закрыть'
          >
            <img className={styles.closeIcon} src={closeIcon} alt='' />
          </button>
        </div>

        <div className={styles.panelContent}>
          <FiltersSidebar hideTitle />
        </div>
      </div>
    </>
  );
};
