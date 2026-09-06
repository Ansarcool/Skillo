import type { FC } from 'react';
import styles from './active-filters-bar.module.css';
import type { TActiveFiltersBarUIProps } from './types.ts';

export const ActiveFiltersBarUI: FC<TActiveFiltersBarUIProps> = ({
  chips,
  onRemoveChip
}) => {
  if (chips.length === 0) return null;

  return (
    <div className={styles.activeFilters}>
      {chips.map((chip) => (
        <span key={chip.key} className={`body ${styles.chip}`}>
          {chip.label}
          <button
            type='button'
            className={styles.chipRemove}
            onClick={() => onRemoveChip(chip.key)}
            aria-label={`Убрать фильтр ${chip.label}`}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
};
