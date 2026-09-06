import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRequestsThunk,
  updateRequestStatusThunk
} from '../../../slices/requestSlice.ts';
import {
  selectInboxRequests,
  selectOutboxRequests,
  selectHistoryRequests
} from '../../../entites/request/lib/selectors.ts';
import type { AppDispatch, RootState } from '../../../services/store.ts';
import { RequestCard } from '../request-card/request-card.tsx';
import styles from './request-tabs.module.css';

type TTab = 'inbox' | 'outbox' | 'history';

export const RequestsTabs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<TTab>('inbox');

  const cardId = useSelector((state: RootState) => state.profile.cardId);
  const validCardId = cardId ?? null;
  const inboxRequests = useSelector(selectInboxRequests(validCardId));
  const outboxRequests = useSelector(selectOutboxRequests(validCardId));
  const historyRequests = useSelector(selectHistoryRequests(validCardId));

  useEffect(() => {
    dispatch(getRequestsThunk());
  }, [dispatch]);

  const requests =
    activeTab === 'inbox'
      ? inboxRequests
      : activeTab === 'outbox'
        ? outboxRequests
        : historyRequests;

  const mode = activeTab === 'outbox' ? 'outbox' : 'inbox';

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <button
          className={`body ${styles.tab} ${activeTab === 'inbox' ? styles.active : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          Входящие
        </button>
        <button
          className={`body ${styles.tab} ${activeTab === 'outbox' ? styles.active : ''}`}
          onClick={() => setActiveTab('outbox')}
        >
          Исходящие
        </button>
        <button
          className={`body ${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
          onClick={() => setActiveTab('history')}
        >
          История
        </button>
      </div>

      <div className={styles.list}>
        {requests.length === 0 && (
          <p className='caption'>
            {activeTab === 'history' ? 'История пуста' : 'Заявок пока нет'}
          </p>
        )}
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            mode={
              activeTab === 'history'
                ? request.fromUserId === cardId
                  ? 'outbox'
                  : 'inbox'
                : mode
            }
            onAccept={(id) =>
              dispatch(updateRequestStatusThunk({ id, status: 'accepted' }))
            }
            onReject={(id) =>
              dispatch(updateRequestStatusThunk({ id, status: 'rejected' }))
            }
            onStartProgress={(id) =>
              dispatch(updateRequestStatusThunk({ id, status: 'inProgress' }))
            }
            onComplete={(id) =>
              dispatch(updateRequestStatusThunk({ id, status: 'done' }))
            }
          />
        ))}
      </div>
    </div>
  );
};
