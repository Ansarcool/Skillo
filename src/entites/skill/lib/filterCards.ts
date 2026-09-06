import type { TSkillCard } from '../../../api/api.ts';
import type { TFilterState } from '../../../slices/filterSlice.ts';

export const filterSkillCards = (
  cards: TSkillCard[],
  filters: TFilterState
): TSkillCard[] =>
  cards.filter((card) => {
    if (filters.selectedSubcategoryIds.length > 0) {
      const relevantSkills =
        filters.learningMode === 'canTeach'
          ? card.canTeach
          : filters.learningMode === 'wantToLearn'
            ? card.wantsToLearn
            : [...card.canTeach, ...card.wantsToLearn];

      const hasMatch = relevantSkills.some((skill) =>
        filters.selectedSubcategoryIds.includes(skill.name)
      );
      if (!hasMatch) return false;
    }

    if (filters.gender !== 'any' && card.gender !== filters.gender) {
      return false;
    }

    if (
      filters.selectedCityIds.length > 0 &&
      !filters.selectedCityIds.includes(card.city)
    ) {
      return false;
    }

    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase();
      const matchesName = card.name.toLowerCase().includes(query);
      const matchesSkills = [...card.canTeach, ...card.wantsToLearn].some(
        (skill) => skill.name.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesSkills) return false;
    }

    return true;
  });
