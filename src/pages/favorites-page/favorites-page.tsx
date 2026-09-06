import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleFavorite } from '../../slices/favoritesSlice.ts';
import { getRequestsThunk } from '../../slices/requestSlice.ts';
import type { AppDispatch, RootState } from '../../services/store.ts';
import type { TSkillCard } from '../../api/api.ts';
import { paginate, getTotalPages } from '../../entites/skill/lib/pagination.ts';
import { FavoritesPageUI } from '../../shared/ui/silly-components/favorites-page-ui/favorites-page-ui.tsx';

export const FavoritesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const profile = useSelector((state: RootState) => state.profile);
  const requests = useSelector((state: RootState) => state.request.items);
  const favCardIds = useSelector((state: RootState) => state.favorites.ids);
  const allCards = useSelector((state: RootState) => state.skills.skillCards);

  useEffect(() => {
    dispatch(getRequestsThunk());
  }, [dispatch]);

  const favIdsSet = new Set(favCardIds);
  const favCards = allCards.filter((card) => favIdsSet.has(card.id));

  const totalPages = getTotalPages(favCards.length);
  const pageCards = paginate(favCards, currentPage);

  const isRequestSent = (card: TSkillCard) =>
    Boolean(
      profile.cardId !== null &&
      requests.some(
        (r) => r.fromUserId === profile.cardId && r.toUserId === card.id
      )
    );

  return (
    <FavoritesPageUI
      favCards={pageCards}
      totalCount={favCards.length}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
      onDetailsClick={(id) => navigate(`/skill/${id}`)}
      isRequestSent={isRequestSent}
    />
  );
};
