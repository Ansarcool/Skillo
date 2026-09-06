import type { RootState } from '../../../services/store.ts';
import type { TRequest } from '../model/types.ts';

const sortByDateDesc = (items: TRequest[]) =>
  [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

export const selectOutboxRequests =
  (cardId: number | null) => (state: RootState) =>
    cardId === null
      ? []
      : sortByDateDesc(
          state.request.items.filter(
            (r) => r.fromUserId === cardId && r.status !== 'rejected'
          )
        );

export const selectInboxRequests =
  (cardId: number | null) => (state: RootState) =>
    cardId === null
      ? []
      : sortByDateDesc(
          state.request.items.filter(
            (r) => r.toUserId === cardId && r.status !== 'rejected'
          )
        );

export const selectHistoryRequests =
  (cardId: number | null) => (state: RootState) =>
    cardId === null
      ? []
      : sortByDateDesc(
          state.request.items.filter(
            (r) =>
              r.status === 'rejected' &&
              (r.fromUserId === cardId || r.toUserId === cardId)
          )
        );
