import { BadgeId } from '../model/types.ts';
import type { TRequest } from '../../request/model/types.ts';
import type { TProfileState } from '../../../api/api.ts';

export const deriveEarnedBadges = (
  requests: TRequest[],
  favoriteIds: number[],
  profile: TProfileState,
  cardId: number | null
): BadgeId[] => {
  const earned: BadgeId[] = [];

  if (cardId === null) return earned;

  const myOutgoing = requests.filter((r) => r.fromUserId === cardId);
  const myAll = requests.filter(
    (r) => r.fromUserId === cardId || r.toUserId === cardId
  );
  const myDoneCount = myAll.filter((r) => r.status === 'done').length;

  if (myOutgoing.length > 0) {
    earned.push(BadgeId.FirstRequestSent);
  }

  if (
    myOutgoing.some(
      (r) =>
        r.status === 'accepted' ||
        r.status === 'inProgress' ||
        r.status === 'done'
    )
  ) {
    earned.push(BadgeId.FirstRequestAccepted);
  }

  if (myDoneCount >= 1) {
    earned.push(BadgeId.FirstExchangeDone);
  }

  if (myDoneCount >= 5) {
    earned.push(BadgeId.FiveExchangesDone);
  }

  if (favoriteIds.length > 0) {
    earned.push(BadgeId.FirstFavorite);
  }

  if (profile.canTeach !== null) {
    earned.push(BadgeId.SkillAdded);
  }

  return earned;
};
