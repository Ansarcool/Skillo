import type { TSkillCard, TProfileState } from '../../../api/api.ts';

export const MY_PROFILE_CARD_ID = -1;

const calcAge = (birthDate: string): number => {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
};

export const buildProfileCard = (
  profile: TProfileState,
  userEmail: string
): TSkillCard | null => {
  if (!profile.canTeach || profile.canTeach.length === 0) return null;
  if (!profile.name || !profile.city) return null;

  return {
    id: MY_PROFILE_CARD_ID,
    name: profile.name || userEmail || 'Вы',
    avatar: profile.avatar || '',
    city: profile.city || '',
    age: calcAge(profile.birthDate),
    gender: profile.gender === 'female' ? 'female' : 'male',
    bio: profile.description || '',
    createdAt: new Date().toISOString(),
    likesCount: 0,
    canTeach: profile.canTeach || [],
    wantsToLearn: profile.wantsToLearn || []
  };
};
