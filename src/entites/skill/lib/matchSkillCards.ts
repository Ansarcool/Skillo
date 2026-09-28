import type { TSkillCard } from '../../../api/api.ts';
import type { TSkillTag } from '../../../shared/ui/skillCard';

const tagsOverlap = (a: TSkillTag[] = [], b: TSkillTag[] = []): boolean =>
  a.some((tagA) =>
    b.some((tagB) =>
      tagA.subcategoryId != null && tagB.subcategoryId != null
        ? tagA.subcategoryId === tagB.subcategoryId
        : tagA.category === tagB.category
    )
  );

export const matchSkillCards = (
  cards: TSkillCard[],
  myCard: TSkillCard
): TSkillCard[] =>
  cards.filter(
    (card) =>
      card.id !== myCard.id &&
      (tagsOverlap(card.canTeach, myCard.wantsToLearn) ||
        tagsOverlap(card.wantsToLearn, myCard.canTeach))
  );
