import { Link } from 'react-router-dom';
import { RequestsTabs } from '../../shared/ui/request-tabs/request-tabs.tsx';
import styles from '../profile/profile.module.css';

export const RequestsPage = () => (
  <div className={styles.page}>
    <div className={styles.mainContainer}>
      <aside className={styles.sidebar}>
        <nav className={styles.sideMenu}>
          <Link
            to='/requests'
            className={`${styles.sideItem} ${styles.sideItemActive}`}
          >
            Заявки
          </Link>
          <Link to='/exchanges' className={styles.sideItem}>
            Мои обмены
          </Link>
          <Link to='/favorites' className={styles.sideItem}>
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
        <RequestsTabs />
      </main>
    </div>
  </div>
);
