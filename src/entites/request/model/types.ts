export type TRequestStatus =
  'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export type TRequest = {
  id: string;
  skillId: number;
  skillName: string;
  fromUserId: number;
  toUserId: number;
  toUserName: string;
  createdAt: string;
  status: TRequestStatus;
};
