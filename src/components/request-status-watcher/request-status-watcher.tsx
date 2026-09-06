import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markStatusesSeen } from '../../slices/requestStatusWatcherSlice.ts';
import { ToastContainer } from '../../shared/ui/silly-components/toast-container/toast-container.tsx';
import type { TToastData } from '../../shared/ui/toast/toast.tsx';
import type { AppDispatch, RootState } from '../../services/store.ts';
import type { TRequestStatus } from '../../entites/request/model/types.ts';
import redHeartIcon from '../../assets/red-heart.png';
import stairsUpIcon from '../../assets/stairs-up.png';
import trophyIcon from '../../assets/trophy.png';
import crossIcon from '../../assets/cross.png';

const STATUS_TOAST_CONFIG: Partial<
  Record<TRequestStatus, { icon: string; title: string }>
> = {
  accepted: { icon: redHeartIcon, title: 'Заявка принята' },
  inProgress: { icon: stairsUpIcon, title: 'Обмен начат' },
  done: { icon: trophyIcon, title: 'Обмен завершен' },
  rejected: { icon: crossIcon, title: 'Заявка отклонена' }
};

export const RequestStatusWatcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [toasts, setToasts] = useState<TToastData[]>([]);

  const requests = useSelector((state: RootState) => state.request.items);
  const seenStatuses = useSelector(
    (state: RootState) => state.requestStatusWatcher.seenStatuses
  );
  const cardId = useSelector((state: RootState) => state.profile.cardId);

  useEffect(() => {
    if (cardId === null) return;

    const myRequests = requests.filter(
      (r) => r.fromUserId === cardId || r.toUserId === cardId
    );

    const changed = myRequests.filter((r) => {
      const lastSeen = seenStatuses[r.id];
      return lastSeen !== undefined && lastSeen !== r.status;
    });

    const relevant = changed.filter((r) => STATUS_TOAST_CONFIG[r.status]);

    if (relevant.length > 0) {
      const newToasts: TToastData[] = relevant.map((r) => {
        const config = STATUS_TOAST_CONFIG[r.status]!;
        return {
          id: `${r.id}-${r.status}-${Date.now()}`,
          icon: config.icon,
          title: config.title,
          description: r.skillName
        };
      });
      setToasts((prev) => [...prev, ...newToasts]);
    }

    const nextSeen = Object.fromEntries(
      myRequests.map((r) => [r.id, r.status])
    );
    dispatch(markStatusesSeen(nextSeen));
  }, [requests, cardId]);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return <ToastContainer toasts={toasts} onDismiss={handleDismiss} />;
};
