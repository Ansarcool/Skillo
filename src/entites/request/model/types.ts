export type TCardId = string | number;

export type TRequestStatus =
  'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export type TRequest = {
  id: string;
  skillId: number;
  skillName: string;
  fromUserId: TCardId;
  toUserId: TCardId;
  toUserName: string;
  createdAt: string;
  status: TRequestStatus;
};
