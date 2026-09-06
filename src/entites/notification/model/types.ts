export type TNotificationType = 'accepted' | 'proposed';

export type TNotification = {
  id: string;
  requestId: string;
  type: TNotificationType;
  title: string;
  subtitle: string;
  date: string;
  actionRoute: string;
};
