import type { FC } from 'react';
import styles from './pagination.module.css';
import type { TPaginationProps } from './types.ts';

export const PaginationUI: FC<TPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination}>
      <button
        type='button'
        className={`body ${styles.navButton}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Назад
      </button>

      <div className={styles.pages}>
        {pages.map((page) => (
          <button
            key={page}
            type='button'
            className={`body ${styles.pageButton} ${
              page === currentPage ? styles.active : ''
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type='button'
        className={`body ${styles.navButton}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Вперёд →
      </button>
    </nav>
  );
};
