export enum BadgeId {
  FirstRequestSent = 'first_request_sent',
  FirstRequestAccepted = 'first_request_accepted',
  FirstExchangeDone = 'first_exchange_done',
  FiveExchangesDone = 'five_exchanges_done',
  FirstFavorite = 'first_favorite',
  SkillAdded = 'skill_added'
}

export type TBadge = {
  id: BadgeId;
  title: string;
  description: string;
  icon: string;
};
