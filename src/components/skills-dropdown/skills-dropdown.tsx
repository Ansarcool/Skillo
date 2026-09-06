import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSkillsThunk } from '../../slices/skillsSlice.ts';
import type { RootState, AppDispatch } from '../../services/store.ts';
import { Dropdown } from '../../shared/ui/dropdown';
import styles from '../../shared/ui/dropdown/dropdown.module.css';
import '../../shared/styles/fonts.css';

type TSkillsDropdownContainerProps = {
  isOpen: boolean;
  onClose?: () => void;
};

export const SkillsDropdownContainer = ({
  isOpen,
  onClose
}: TSkillsDropdownContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, isLoading, error } = useSelector(
    (state: RootState) => state.skills
  );

  useEffect(() => {
    if (isOpen && skills.length === 0) {
      dispatch(getSkillsThunk());
    }
  }, [isOpen, skills.length, dispatch]);

  return (
    <Dropdown isOpen={isOpen} onClose={onClose}>
      {isLoading && <p>Загрузка навыков...</p>}
      {error && <p>Ошибка: {error}</p>}
      {!isLoading && !error && (
        <>
          {skills.map((category) => (
            <div key={category.id} className={styles.categoryItem}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryIconWrapper}>
                  <img
                    src={category.icon}
                    className={styles.categoryIcon}
                    alt=''
                  />
                </div>
                <h2 className={styles.skillTitle}>{category.category}</h2>
              </div>
              <div className={styles.skillsList}>
                {category.skills.map((skill) => (
                  <a
                    key={skill.id}
                    href='#'
                    className={`body ${styles.skillLink}`}
                  >
                    {skill.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </Dropdown>
  );
};
