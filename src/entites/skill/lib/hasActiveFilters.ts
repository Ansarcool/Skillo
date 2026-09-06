import type { TFilterState } from '../../../slices/filterSlice.ts';

export const hasActiveFilters = (filters: TFilterState): boolean =>
  filters.learningMode !== 'all' ||
  filters.selectedSubcategoryIds.length > 0 ||
  filters.gender !== 'any' ||
  filters.selectedCityIds.length > 0 ||
  filters.search.trim().length > 0;
