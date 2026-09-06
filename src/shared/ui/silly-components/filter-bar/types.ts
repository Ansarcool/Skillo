import type { TFilterChip } from '../../active-filters-bar/types.ts';

export type TSkillCategoryFilter = {
  id: number;
  category: string;
  skills: { id: number; name: string }[];
};

export type TFiltersSidebarUIProps = {
  skillCategories: TSkillCategoryFilter[];
  isLoading: boolean;
  error: string | null;
  learningMode: 'all' | 'wantToLearn' | 'canTeach';
  onLearningModeChange: (mode: 'all' | 'wantToLearn' | 'canTeach') => void;
  gender: 'any' | 'male' | 'female';
  onGenderChange: (gender: 'any' | 'male' | 'female') => void;
  cities: { id: string; label: string }[];
  selectedCityIds: string[];
  onCityToggle: (id: string) => void;
  hideTitle?: boolean;
  chips: TFilterChip[];
  onRemoveChip?: (key: string) => void;
  onResetAll?: () => void;
  radioNamePrefix?: string;
};
