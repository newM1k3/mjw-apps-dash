import type { UserTier } from '../types';

const tierRank: Record<UserTier, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

export const canAccess = (userTier: UserTier, requiredTier: UserTier): boolean => {
  return tierRank[userTier] >= tierRank[requiredTier];
};
