import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deriveEarnedBadges } from '../../entites/badge/lib/deriveEarnedBadges.ts';
import { BADGES_CATALOG } from '../../entites/badge/model/badges-catalog.ts';
import { unlockBadges } from '../../slices/badgeSlice.ts';
import { ToastContainer } from '../../shared/ui/silly-components/toast-container/toast-container.tsx';
import type { TToastData } from '../../shared/ui/toast/toast.tsx';
import type { AppDispatch, RootState } from '../../services/store.ts';

export const BadgeWatcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [toasts, setToasts] = useState<TToastData[]>([]);

  const requests = useSelector((state: RootState) => state.request.items);
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const profile = useSelector((state: RootState) => state.profile);
  const unlockedIds = useSelector(
    (state: RootState) => state.badges.unlockedIds
  );

  useEffect(() => {
    const earned = deriveEarnedBadges(
      requests,
      favoriteIds,
      profile,
      profile.cardId ?? null
    );
    const newlyEarned = earned.filter((id) => !unlockedIds.includes(id));

    if (newlyEarned.length === 0) return;

    const newToasts: TToastData[] = newlyEarned.map((id) => {
      const badge = BADGES_CATALOG[id];
      return {
        id: `${badge.id}-${Date.now()}`,
        icon: badge.icon,
        title: `Новый бейдж: ${badge.title}`,
        description: badge.description
      };
    });

    setToasts((prev) => [...prev, ...newToasts]);
    dispatch(unlockBadges(newlyEarned));
  }, [requests, favoriteIds, profile, unlockedIds, dispatch]);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return <ToastContainer toasts={toasts} onDismiss={handleDismiss} />;
};
