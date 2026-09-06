import type { FC } from 'react';
import { Button } from '../../shared/ui/button';
import styles from './not-found.module.css';

import errorIllustration from '../../../public/icons/error-404.svg';

export const NotFoundPage: FC = () => (
  <div className={styles.page}>
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={errorIllustration}
          alt='404 Ошибка'
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={`body ${styles.subtitle}`}>
          К сожалению, эта страница недоступна. Вернитесь на главную страницу
          или попробуйте позже
        </p>
      </div>

      <div className={styles.actions}>
        <Button
          type='secondary'
          size='medium'
          className={`body ${styles.reportButton}`}
        >
          Сообщить об ошибке
        </Button>
        <Button
          type='primary'
          size='medium'
          to='/'
          className={`body ${styles.homeButton}`}
        >
          На главную
        </Button>
      </div>
    </div>
  </div>
);
