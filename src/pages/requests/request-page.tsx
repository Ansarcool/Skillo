import { NavLink } from 'react-router-dom';
import { RequestsTabs } from '../../shared/ui/request-tabs/request-tabs.tsx';
import styles from '../../shared/ui/silly-components/favorites-page-ui/favorites-page.module.css';
import emailIcon from '../../../public/icons/request.svg';
import messageIcon from '../../../public/icons/message-text.svg';
import heartIcon from '../../../public/icons/like.svg';
import ideaIcon from '../../../public/icons/idea.svg';
import userIcon from '../../../public/icons/user.svg';

export const RequestsPage = () => (
  <div className={styles.page}>
    <div className={styles.mainContainer}>
      <aside className={styles.sidebar}>
        <nav className={styles.sideMenu}>
          <NavLink
            to='/requests'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={emailIcon} alt='' /> Заявки
          </NavLink>
          <NavLink
            to='/exchanges'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={messageIcon} alt='' /> Мои обмены
          </NavLink>
          <NavLink
            to='/favorites'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={heartIcon} alt='' /> Избранное
          </NavLink>
          <NavLink
            to='/my-skills'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={ideaIcon} alt='' /> Мои навыки
          </NavLink>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `body ${styles.sideItem} ${isActive ? styles.sideItemActive : ''}`
            }
          >
            <img src={userIcon} alt='' /> Личные данные
          </NavLink>
        </nav>
      </aside>

      <main className={styles.contentCard}>
        <RequestsTabs />
      </main>
    </div>
  </div>
);
