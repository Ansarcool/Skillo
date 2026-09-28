import type { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './footer.module.css';
import logoIcon from '../../../public/icons/Logo.png';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <Link to='/' className={styles.logoLink}>
            <img src={logoIcon} alt='logo' className={styles.logo} />
          </Link>
          <p className='caption'>Skillo - {currentYear}</p>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.columns}>
            <div className={styles.column}>
              <Link to='/about' className={`body ${styles.link}`}>
                О проекте
              </Link>
              <Link to='/skills' className={`body ${styles.link}`}>
                Все навыки
              </Link>
            </div>

            <div className={styles.column}>
              <Link to='/contacts' className={`body ${styles.link}`}>
                Контакты
              </Link>
              <Link to='/blog' className={`body ${styles.link}`}>
                Блог
              </Link>
            </div>
            <div className={styles.column}>
              <Link to='/privacy' className={`body ${styles.link}`}>
                Политика конфиденциальности
              </Link>
              <Link to='/terms' className={`body ${styles.link}`}>
                Пользовательское соглашение
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
