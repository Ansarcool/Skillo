import { type FC, useState } from 'react';
import { CategoryAccordion } from '../../category-accordion';
import { Radio } from '../../radio';
import styles from '../../silly-components/filter-bar/filter-sidebar.module.css';
import type { TFiltersSidebarUIProps } from './types.ts';
import { Checkbox } from '../../checkbox';

const VISIBLE_CATEGORIES_COUNT = 6;
const VISIBLE_CITIES_COUNT = 5;

export const FiltersSidebarUI: FC<TFiltersSidebarUIProps> = ({
  skillCategories,
  isLoading,
  error,
  learningMode,
  onLearningModeChange,
  gender,
  onGenderChange,
  cities,
  selectedCityIds,
  onCityToggle,
  hideTitle = false,
  chips,
  onResetAll,
  radioNamePrefix = ''
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const visibleCategories = showAllCategories
    ? skillCategories
    : skillCategories.slice(0, VISIBLE_CATEGORIES_COUNT);

  const visibleCities = showAllCities
    ? cities
    : cities.slice(0, VISIBLE_CITIES_COUNT);

  return (
    <aside className={styles.filtersSidebar}>
      <div className={styles.top}>
        {!hideTitle && (
          <h3>
            {chips.length === 0 ? 'Фильтры' : `Фильтры (${chips.length})`}
          </h3>
        )}
        {chips.length > 0 && (
          <button
            type='button'
            className={`body ${styles.reset}`}
            onClick={onResetAll}
          >
            Сбросить ✕
          </button>
        )}
      </div>
      <div className={styles.filterGroup}>
        <Radio
          label='Всё'
          name={`learning-mode-${radioNamePrefix}`}
          checked={learningMode === 'all'}
          onChange={() => onLearningModeChange('all')}
        />
        <Radio
          label='Хочу научиться'
          name={`learning-mode-${radioNamePrefix}`}
          checked={learningMode === 'wantToLearn'}
          onChange={() => onLearningModeChange('wantToLearn')}
        />
        <Radio
          label='Могу научить'
          name={`learning-mode-${radioNamePrefix}`}
          checked={learningMode === 'canTeach'}
          onChange={() => onLearningModeChange('canTeach')}
        />
      </div>

      <div className={styles.filterGroup}>
        <h3>Навыки</h3>

        {isLoading && <p className='caption'>Загрузка...</p>}
        {error && <p className='caption'>Ошибка: {error}</p>}

        {!isLoading &&
          !error &&
          visibleCategories.map((category) => (
            <CategoryAccordion
              key={category.id}
              title={category.category}
              subcategories={category.skills.map((skill) => ({
                id: skill.name,
                label: skill.name
              }))}
            />
          ))}

        {skillCategories.length > VISIBLE_CATEGORIES_COUNT && (
          <button
            type='button'
            className={`caption ${styles.expandButton}`}
            onClick={() => setShowAllCategories((prev) => !prev)}
          >
            {showAllCategories ? 'Скрыть' : 'Все категории'} ⌄
          </button>
        )}
      </div>

      <div className={styles.filterGroup}>
        <h3>Пол автора</h3>
        <Radio
          label='Не имеет значения'
          name={`gender-${radioNamePrefix}`}
          checked={gender === 'any'}
          onChange={() => onGenderChange('any')}
        />
        <Radio
          label='Мужской'
          name={`gender-${radioNamePrefix}`}
          checked={gender === 'male'}
          onChange={() => onGenderChange('male')}
        />
        <Radio
          label='Женский'
          name={`gender-${radioNamePrefix}`}
          checked={gender === 'female'}
          onChange={() => onGenderChange('female')}
        />
      </div>

      <div className={styles.filterGroup}>
        <h3>Город</h3>
        {visibleCities.map((city) => (
          <Checkbox
            key={city.id}
            label={city.label}
            checked={selectedCityIds.includes(city.id)}
            onChange={() => onCityToggle(city.id)}
          />
        ))}

        {cities.length > VISIBLE_CITIES_COUNT && (
          <button
            type='button'
            className={`caption ${styles.expandButton}`}
            onClick={() => setShowAllCities((prev) => !prev)}
          >
            {showAllCities ? 'Скрыть' : 'Все города'} ⌄
          </button>
        )}
      </div>
    </aside>
  );
};
