import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRequestsThunk,
  updateRequestStatusThunk
} from '../../slices/requestSlice.ts';
import type { AppDispatch, RootState } from '../../services/store.ts';
import type { TRequest } from '../../entites/request/model/types.ts';
import { ExchangesPageUI } from '../../shared/ui/silly-components/exchange-page/exchange-page-ui.tsx';

const EXCHANGE_STATUSES: TRequest['status'][] = [
  'accepted',
  'inProgress',
  'done'
];

export const ExchangesPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const requests = useSelector((state: RootState) => state.request.items);
  const cardId = useSelector((state: RootState) => state.profile.cardId);

  useEffect(() => {
    dispatch(getRequestsThunk());
  }, [dispatch]);

  const myExchanges = requests
    .filter(
      (r) =>
        EXCHANGE_STATUSES.includes(r.status) &&
        (r.fromUserId === cardId || r.toUserId === cardId)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const getMode = (request: TRequest): 'inbox' | 'outbox' =>
    request.fromUserId === cardId ? 'outbox' : 'inbox';

  return (
    <ExchangesPageUI
      exchanges={myExchanges}
      getMode={getMode}
      onStartProgress={(id) =>
        dispatch(updateRequestStatusThunk({ id, status: 'inProgress' }))
      }
      onComplete={(id) =>
        dispatch(updateRequestStatusThunk({ id, status: 'done' }))
      }
    />
  );
};
