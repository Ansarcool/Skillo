import { useEffect, useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../services/store.ts';
import { getSkillsThunk } from '../../slices/skillsSlice.ts';
import {
  setLearningMode,
  setGender,
  toggleCity,
  toggleSubcategory,
  resetFilters
} from '../../slices/filterSlice.ts';
import { FiltersSidebarUI } from '../../shared/ui/silly-components/filter-bar/filters-sidebar.tsx';
import type { TFilterChip } from '../../shared/ui/active-filters-bar/types.ts';

const cities = [
  { id: 'Лондон', label: 'Лондон' },
  { id: 'Хельсинки', label: 'Хельсинки' },
  { id: 'Будапешт', label: 'Будапешт' },
  { id: 'Таллин', label: 'Таллин' },
  { id: 'Роттердам', label: 'Роттердам' }
];
type TFiltersSidebarProps = {
  hideTitle?: boolean;
};
export const FiltersSidebar = ({ hideTitle }: TFiltersSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, isLoading, error } = useSelector(
    (state: RootState) => state.skills
  );
  const filters = useSelector((state: RootState) => state.filter);
  const { learningMode, gender, selectedCityIds } = useSelector(
    (state: RootState) => state.filter
  );
  const chips: TFilterChip[] = [];
  const instanceId = useId();

  if (filters.learningMode !== 'all') {
    chips.push({
      key: 'learning-mode',
      label:
        filters.learningMode === 'wantToLearn'
          ? 'Хочу научиться'
          : 'Могу научить'
    });
  }

  filters.selectedSubcategoryIds.forEach((name) => {
    chips.push({ key: `skill:${name}`, label: name });
  });

  if (filters.gender !== 'any') {
    chips.push({
      key: 'gender',
      label: filters.gender === 'male' ? 'Мужской' : 'Женский'
    });
  }

  filters.selectedCityIds.forEach((city) => {
    chips.push({ key: `city:${city}`, label: city });
  });

  const handleRemoveChip = (key: string) => {
    if (key === 'learning-mode') {
      dispatch(setLearningMode('all'));
    } else if (key === 'gender') {
      dispatch(setGender('any'));
    } else if (key.startsWith('skill:')) {
      dispatch(toggleSubcategory(key.replace('skill:', '')));
    } else if (key.startsWith('city:')) {
      dispatch(toggleCity(key.replace('city:', '')));
    }
  };

  useEffect(() => {
    if (skills.length === 0) {
      dispatch(getSkillsThunk());
    }
  }, [skills.length, dispatch]);

  return (
    <FiltersSidebarUI
      skillCategories={skills}
      isLoading={isLoading}
      error={error}
      learningMode={learningMode}
      onLearningModeChange={(mode) => dispatch(setLearningMode(mode))}
      gender={gender}
      onGenderChange={(g) => dispatch(setGender(g))}
      cities={cities}
      selectedCityIds={selectedCityIds}
      onCityToggle={(id) => dispatch(toggleCity(id))}
      hideTitle={hideTitle}
      chips={chips}
      onRemoveChip={handleRemoveChip}
      onResetAll={() => dispatch(resetFilters())}
      radioNamePrefix={instanceId}
    />
  );
};
