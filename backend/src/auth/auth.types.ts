export type RequestUser = {
  userId: string;
  orgId: string;
  role: 'admin' | 'member';
};
