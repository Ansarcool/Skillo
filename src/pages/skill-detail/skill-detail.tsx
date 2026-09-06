import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSkillCardsThunk } from '../../slices/skillsSlice.ts';
import { toggleFavorite } from '../../slices/favoritesSlice.ts';
import type { AppDispatch, RootState } from '../../services/store.ts';
import { SkillDetailPageUI } from '../../shared/ui/silly-components/skill-detail/skill-detail.tsx';
import {
  createRequestThunk,
  getRequestsThunk
} from '../../slices/requestSlice.ts';
import { ExchangeProposedModal } from '../../shared/ui/exchange-proposed-modal/exchange-proposed-modal.tsx';
import { NotFoundPage } from '../not-found/not-found.tsx';
import { buildProfileCard } from '../../entites/skill/lib/buildProfileCard.ts';

const PLACEHOLDER_IMAGES_COUNT = 4;
const SIMILAR_CARDS_LIMIT = 4;

export const SkillDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { skillCards, isLoading } = useSelector(
    (state: RootState) => state.skills
  );

  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const [activeImage, setActiveImage] = useState(0);
  const profile = useSelector((state: RootState) => state.profile);
  const requests = useSelector((state: RootState) => state.request.items);
  const authEmail = useSelector((state: RootState) => state.auth.user?.email);

  const myProfileCard = buildProfileCard(profile, authEmail ?? '');
  const allCards = myProfileCard ? [myProfileCard, ...skillCards] : skillCards;

  useEffect(() => {
    if (skillCards.length === 0) {
      dispatch(getSkillCardsThunk());
    }
  }, [skillCards.length, dispatch]);

  useEffect(() => {
    dispatch(getRequestsThunk());
  }, [dispatch]);

  const card = allCards.find((c) => c.id === Number(userId));
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  const handleProposeExchange = () => {
    if (profile.cardId === null || profile.cardId === undefined) {
      alert('Напиши id карточки в профиле');
      navigate('/profile');
      return;
    }

    if (!card || !card.canTeach[0]) return;

    dispatch(
      createRequestThunk({
        skillId: card.canTeach[0].id ?? 0,
        skillName: card.canTeach[0].name,
        fromUserId: profile.cardId,
        toUserId: card.id,
        toUserName: card.name
      })
    );
    setIsProposeModalOpen(true);
  };

  if (isLoading) return <p>Загрузка...</p>;
  if (!card) return <NotFoundPage />;

  const images = Array.from(
    { length: PLACEHOLDER_IMAGES_COUNT },
    (_, i) => `https://picsum.photos/seed/${card.id}-${i}/600/500`
  );

  const mainSkillCategory = card.canTeach[0]?.category;

  const isRequestSent = Boolean(
    profile.cardId !== null &&
    profile.cardId !== undefined &&
    requests.some(
      (r) => r.fromUserId === profile.cardId && r.toUserId === card.id
    )
  );

  const filteredByCategory = skillCards.filter(
    (c) =>
      c.id !== card.id &&
      c.canTeach.some((skill) => skill.category === mainSkillCategory)
  );

  const similarCards = (
    filteredByCategory.length > 0
      ? filteredByCategory
      : skillCards.filter((c) => c.id !== card.id)
  ).slice(0, SIMILAR_CARDS_LIMIT);

  const sentRequestCardIds = requests
    .filter((r) => profile.cardId != null && r.fromUserId === profile.cardId)
    .map((r) => r.toUserId);

  return (
    <>
      <SkillDetailPageUI
        card={card}
        similarCards={similarCards}
        favoriteIds={favoriteIds}
        activeImage={activeImage}
        images={images}
        onImageChange={setActiveImage}
        onPrevImage={() =>
          setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        }
        onNextImage={() =>
          setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        }
        onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
        onSimilarCardClick={(id) => navigate(`/skill/${id}`)}
        onProposeExchange={handleProposeExchange}
        isRequestSent={isRequestSent}
        sentRequestCardIds={sentRequestCardIds}
      />
      {isProposeModalOpen && (
        <ExchangeProposedModal onClose={() => setIsProposeModalOpen(false)} />
      )}
    </>
  );
};
