import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { matchSkillCards } from '../../entites/skill/lib/matchSkillCards.ts';
import styles from './skill-cards-results.module.css';
import { getRequestsThunk } from '../../slices/requestSlice.ts';
import { buildProfileCard } from '../../entites/skill/lib/buildProfileCard.ts';
import sortIcon from '../../../public/icons/sort.svg';

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
  const [searchParams] = useSearchParams();

  const {
    skillCards = [],
    isLoading,
    error
  } = useSelector((state: RootState) => state.skills);
  const requests = useSelector((state: RootState) => state.request.items);
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.ids || []
  );
  const filters = useSelector((state: RootState) => state.filter);
  const profile = useSelector((state: RootState) => state.profile);
  const token = useSelector((state: RootState) => state.auth.token);
  const authEmail = useSelector((state: RootState) => state.auth.user?.email);

  const isAuthenticated = Boolean(token);
  const myProfileCard = isAuthenticated
    ? buildProfileCard(profile, authEmail ?? '')
    : null;

  const allCardsWithMine = myProfileCard
    ? [myProfileCard, ...skillCards]
    : skillCards;

  const sortParam = searchParams.get('sort') as TSortMode;
  const sortMode: TSortMode =
    sortParam === 'popular' || sortParam === 'newest' ? sortParam : 'newest';
  const isMatchMode = searchParams.get('match') === '1';

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (skillCards.length === 0) {
      dispatch(getSkillCardsThunk());
    }
  }, [skillCards.length, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortMode]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getRequestsThunk());
    }
  }, [isAuthenticated, dispatch]);

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const isFiltering = hasActiveFilters(filters);
  const showFullGrid = isFiltering || forceShowAll;

  const isCardRequestSent = (cardId: number) => {
    if (!profile?.cardId || !Array.isArray(requests)) return false;
    return requests.some(
      (r) => r.fromUserId === profile.cardId && r.toUserId === cardId
    );
  };

  const baseCards =
    isMatchMode && myProfileCard
      ? matchSkillCards(allCardsWithMine, myProfileCard)
      : allCardsWithMine;

  const filteredCards = filterSkillCards(baseCards, filters);

  const sortedCards = [...filteredCards].sort((a, b) =>
    sortMode === 'popular'
      ? b.likesCount - a.likesCount
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleToggleSort = () => {
    const nextSort = sortMode === 'newest' ? 'popular' : 'newest';
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', nextSort);
    navigate(`?${newParams.toString()}`, { replace: true });
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
    const headingText = isMatchMode
      ? `Точные совпадения: ${filteredCards.length}`
      : isFiltering
        ? `Подходящие предложения: ${filteredCards.length}`
        : `Все предложения: ${filteredCards.length}`;

    return (
      <div>
        <div className={styles.resultsHeader}>
          <h1 className='h1'>{headingText}</h1>
          <button
            type='button'
            className={`body ${styles.sortButton}`}
            onClick={handleToggleSort}
          >
            <img src={sortIcon} alt='' /> {SORT_LABELS[sortMode]}
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

  if (isAuthenticated && myProfileCard) {
    const exactMatchCards = matchSkillCards(skillCards, myProfileCard).slice(
      0,
      SECTION_CARDS_LIMIT
    );

    const newIdeasCards = [...skillCards]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, SECTION_CARDS_LIMIT);

    const recommendedCards = skillCards
      .filter((card) => !favoriteIds.includes(card.id))
      .slice(0, SECTION_CARDS_LIMIT);

    return (
      <div className={styles.sectionsGroup}>
        <SkillCardsSection
          title='Точное совпадение'
          onShowAllClick={() => navigate('/catalog?match=1')}
        >
          {exactMatchCards.map(renderCard)}
        </SkillCardsSection>

        <SkillCardsSection
          title='Новые идеи'
          onShowAllClick={() => navigate('/catalog?sort=newest')}
        >
          {newIdeasCards.map(renderCard)}
        </SkillCardsSection>

        <SkillCardsSection
          title='Рекомендуем'
          onShowAllClick={() => navigate('/catalog')}
        >
          {recommendedCards.map(renderCard)}
        </SkillCardsSection>
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
    <div className={styles.sectionsGroup}>
      <SkillCardsSection
        title='Популярное'
        onShowAllClick={() => navigate('/catalog?sort=popular')}
      >
        {popularCards.map(renderCard)}
      </SkillCardsSection>

      <SkillCardsSection
        title='Новое'
        onShowAllClick={() => navigate('/catalog?sort=newest')}
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
