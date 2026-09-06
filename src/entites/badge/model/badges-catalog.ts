import { BadgeId, type TBadge } from './types.ts';
import redHeartIcon from '../../../assets/red-heart.png';
import stairsUpIcon from '../../../assets/stairs-up.png';
import bookIcon from '../../../assets/books.png';
import trophyIcon from '../../../assets/trophy.png';
import favoriteIcon from '../../../assets/favorite.png';
import shareIcon from '../../../assets/107784.png';

export const BADGES_CATALOG: Record<BadgeId, TBadge> = {
  [BadgeId.FirstRequestSent]: {
    id: BadgeId.FirstRequestSent,
    title: 'Первый шаг',
    description: 'Вы отправили первую заявку на обмен',
    icon: stairsUpIcon
  },
  [BadgeId.FirstRequestAccepted]: {
    id: BadgeId.FirstRequestAccepted,
    title: 'Взаимность',
    description: 'Вашу заявку впервые приняли',
    icon: redHeartIcon
  },
  [BadgeId.FirstExchangeDone]: {
    id: BadgeId.FirstExchangeDone,
    title: 'Первый обмен',
    description: 'Вы завершили свой первый обмен навыками',
    icon: bookIcon
  },
  [BadgeId.FiveExchangesDone]: {
    id: BadgeId.FiveExchangesDone,
    title: 'Опытный обменщик',
    description: 'Вы завершили 5 обменов',
    icon: trophyIcon
  },
  [BadgeId.FirstFavorite]: {
    id: BadgeId.FirstFavorite,
    title: 'Присмотрелись',
    description: 'Вы добавили первое предложение в избранное',
    icon: favoriteIcon
  },
  [BadgeId.SkillAdded]: {
    id: BadgeId.SkillAdded,
    title: 'Есть чем поделиться',
    description: 'Вы указали навык, которому можете научить',
    icon: shareIcon
  }
};
