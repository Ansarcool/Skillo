import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../services/store.ts';
import {
  setLearningMode,
  setGender,
  toggleSubcategory,
  toggleCategoryGroup,
  toggleCity,
  resetFilters
} from '../../slices/filterSlice.ts';
import { ActiveFiltersBarUI } from '../../shared/ui/active-filters-bar/active-filters-bar.tsx';
import type { TFilterChip } from '../../shared/ui/active-filters-bar/types.ts';

export const ActiveFiltersBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.filter);
  const skills = useSelector((state: RootState) => state.skills.skills);

  const chips: TFilterChip[] = [];

  if (filters.learningMode !== 'all') {
    chips.push({
      key: 'learning-mode',
      label:
        filters.learningMode === 'wantToLearn'
          ? 'Хочу научиться'
          : 'Могу научить'
    });
  }
  const fullCategoryIds = new Set<number>();

  skills.forEach((category) => {
    const names = category.skills.map((skill) => skill.name);
    const allSelected =
      names.length > 0 &&
      names.every((name) => filters.selectedSubcategoryIds.includes(name));

    if (allSelected) {
      fullCategoryIds.add(category.id);
      chips.push({
        key: `category:${category.id}`,
        label: category.category
      });
    }
  });

  filters.selectedSubcategoryIds.forEach((name) => {
    const isInFullCategory = skills.some(
      (category) =>
        fullCategoryIds.has(category.id) &&
        category.skills.some((skill) => skill.name === name)
    );

    if (!isInFullCategory) {
      chips.push({ key: `skill:${name}`, label: name });
    }
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
    } else if (key.startsWith('category:')) {
      const categoryId = Number(key.replace('category:', ''));
      const category = skills.find((c) => c.id === categoryId);
      if (category) {
        dispatch(
          toggleCategoryGroup({
            subcategoryIds: category.skills.map((skill) => skill.name),
            selectAll: false
          })
        );
      }
    } else if (key.startsWith('skill:')) {
      dispatch(toggleSubcategory(key.replace('skill:', '')));
    } else if (key.startsWith('city:')) {
      dispatch(toggleCity(key.replace('city:', '')));
    }
  };

  return (
    <ActiveFiltersBarUI
      chips={chips}
      onRemoveChip={handleRemoveChip}
      onResetAll={() => dispatch(resetFilters())}
    />
  );
};
