import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSkillCardsThunk } from '../../slices/skillsSlice.ts';
import { toggleFavorite } from '../../slices/favoritesSlice.ts';
import type { RootState, AppDispatch } from '../../services/store.ts';
import type { TSkillCard } from '../../api/api.ts';
import { SkillCardUI } from '../../shared/ui/skillCard';
import { SkillCardsSection } from '../../shared/ui/silly-components/skill-cards-section';
import { PaginationUI } from '../../shared/ui/pagination/pagination.tsx';
import { filterSkillCards } from '../../entites/skill/lib/filterCards.ts';
import { hasActiveFilters } from '../../entites/skill/lib/hasActiveFilters.ts';
import { paginate, getTotalPages } from '../../entites/skill/lib/pagination.ts';
import styles from './skill-cards-results.module.css';
import { getRequestsThunk } from '../../slices/requestSlice.ts';
import { buildProfileCard } from '../../entites/skill/lib/buildProfileCard.ts';

const SECTION_CARDS_LIMIT = 3;

type TSortMode = 'newest' | 'popular';

const SORT_LABELS: Record<TSortMode, string> = {
  newest: 'Сначала новые',
  popular: 'Сначала популярные'
};

type TSkillCardsContainerProps = {
  forceShowAll?: boolean;
};

export const SkillCardsContainer = ({
  forceShowAll = false
}: TSkillCardsContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { skillCards, isLoading, error } = useSelector(
    (state: RootState) => state.skills
  );
  const requests = useSelector((state: RootState) => state.request.items);
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const filters = useSelector((state: RootState) => state.filter);
  const profile = useSelector((state: RootState) => state.profile);
  const authEmail = useSelector((state: RootState) => state.auth.user?.email);
  const [sortMode, setSortMode] = useState<TSortMode>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const myProfileCard = buildProfileCard(profile, authEmail ?? '');
  const allCardsWithMine = myProfileCard
    ? [myProfileCard, ...skillCards]
    : skillCards;

  useEffect(() => {
    if (skillCards.length === 0) {
      dispatch(getSkillCardsThunk());
    }
  }, [skillCards.length, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortMode]);

  useEffect(() => {
    dispatch(getRequestsThunk());
  }, [dispatch]);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const isFiltering = hasActiveFilters(filters);
  const showFullGrid = isFiltering || forceShowAll;

  const isCardRequestSent = (cardId: number) =>
    Boolean(
      profile.cardId !== null &&
      requests.some(
        (r) => r.fromUserId === profile.cardId && r.toUserId === cardId
      )
    );
  const filteredCards = filterSkillCards(allCardsWithMine, filters);

  const sortedCards = [...filteredCards].sort((a, b) =>
    sortMode === 'popular'
      ? b.likesCount - a.likesCount
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleToggleSort = () => {
    setSortMode((prev) => (prev === 'newest' ? 'popular' : 'newest'));
  };

  const totalPages = getTotalPages(sortedCards.length);
  const pageCards = paginate(sortedCards, currentPage);

  const renderCard = (card: TSkillCard) => (
    <SkillCardUI
      key={card.id}
      avatar={card.avatar}
      name={card.name}
      city={card.city}
      age={card.age}
      isFavorite={favoriteIds.includes(card.id)}
      onToggleFavorite={() => dispatch(toggleFavorite(card.id))}
      onDetailsClick={() => navigate(`/skill/${card.id}`)}
      canTeach={card.canTeach}
      wantsToLearn={card.wantsToLearn}
      isRequestSent={isCardRequestSent(card.id)}
    />
  );

  if (showFullGrid) {
    return (
      <div>
        <div className={styles.resultsHeader}>
          <h2 className='h2'>
            {isFiltering
              ? `Подходящие предложения: ${filteredCards.length}`
              : `Все предложения: ${filteredCards.length}`}
          </h2>
          <button
            type='button'
            className={`body ${styles.sortButton}`}
            onClick={handleToggleSort}
          >
            ↑↓ {SORT_LABELS[sortMode]}
          </button>
        </div>
        <div className={styles.resultsGrid}>{pageCards.map(renderCard)}</div>
        <PaginationUI
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  }

  const popularCards = [...skillCards]
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, SECTION_CARDS_LIMIT);

  const newestCards = [...skillCards]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, SECTION_CARDS_LIMIT);

  const recommendedCards = skillCards
    .filter((card) => !favoriteIds.includes(card.id))
    .slice(0, SECTION_CARDS_LIMIT);

  return (
    <div>
      <SkillCardsSection
        title='Популярное'
        onShowAllClick={() => navigate('/catalog')}
      >
        {popularCards.map(renderCard)}
      </SkillCardsSection>

      <SkillCardsSection
        title='Новое'
        onShowAllClick={() => navigate('/catalog')}
      >
        {newestCards.map(renderCard)}
      </SkillCardsSection>

      <SkillCardsSection
        title='Рекомендуем'
        onShowAllClick={() => navigate('/catalog')}
      >
        {recommendedCards.map(renderCard)}
      </SkillCardsSection>
    </div>
  );
};
