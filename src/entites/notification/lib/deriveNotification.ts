import type { TRequest } from '../../request/model/types.ts';
import type { TNotification } from '../model/types.ts';

export const deriveNotifications = (
  requests: TRequest[],
  cardId: number | null
): TNotification[] => {
  if (cardId === null) return [];

  const notifications: TNotification[] = [];

  requests.forEach((r) => {
    if (r.fromUserId === cardId && r.status === 'accepted') {
      notifications.push({
        id: `${r.id}-accepted`,
        requestId: r.id,
        type: 'accepted',
        title: `${r.toUserName} принял ваш обмен`,
        subtitle: 'Перейдите в профиль, чтобы обсудить детали',
        date: r.createdAt,
        actionRoute: '/requests'
      });
    }

    if (r.toUserId === cardId && r.status === 'pending') {
      notifications.push({
        id: `${r.id}-proposed`,
        requestId: r.id,
        type: 'proposed',
        title: `${r.skillName}: предлагают обмен`,
        subtitle: 'Примите обмен, чтобы обсудить детали',
        date: r.createdAt,
        actionRoute: '/requests'
      });
    }
  });

  return notifications.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
