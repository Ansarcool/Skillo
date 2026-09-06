import type { TSkillTag } from '../ui/skillCard';

export const CATEGORY_ID_TO_SLUG: Record<number, TSkillTag['category']> = {
  1: 'business',
  2: 'creative',
  3: 'languages',
  4: 'education',
  5: 'home',
  6: 'health'
};

export const SLUG_TO_CATEGORY_ID: Record<TSkillTag['category'], number> = {
  business: 1,
  creative: 2,
  languages: 3,
  education: 4,
  home: 5,
  health: 6
};

export const categoryLabelBySlug: Record<string, string> = {
  business: 'Бизнес и карьера',
  creative: 'Творчество и искусство',
  languages: 'Иностранные языки',
  education: 'Образование и развитие',
  home: 'Дом и уют',
  health: 'Здоровье и лайфстайл'
};
export const getCategorySlugById = (id: number): TSkillTag['category'] =>
  CATEGORY_ID_TO_SLUG[id] ?? 'business';

export const getCategoryIdBySlug = (
  slug: TSkillTag['category'] | undefined
): number | null => (slug ? SLUG_TO_CATEGORY_ID[slug] : null);
