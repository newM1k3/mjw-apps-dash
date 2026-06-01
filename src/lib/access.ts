import type { UserTier } from '../types';
import { isBetaEnabled } from './beta';

const tierRank: Record<UserTier, number> = {
  free: 0,
  pro: 1,
  enterprise: 2,
};

/** Original tier comparison — preserved for post-beta restoration. */
export const canAccess = (userTier: UserTier, requiredTier: UserTier): boolean => {
  return tierRank[userTier] >= tierRank[requiredTier];
};

/**
 * Beta-aware access check.
 *
 * When beta all-access is enabled (VITE_ENABLE_BETA_ALL_ACCESS !== 'false'),
 * all signed-in users can access every tool. When beta mode is off, this
 * falls back to the original tier comparison above.
 *
 * Pass `isAuthenticated = false` for unauthenticated users — beta all-access
 * does not bypass authentication, only tier gating.
 */
export const canAccessInContext = (
  userTier: UserTier,
  requiredTier: UserTier,
  isAuthenticated: boolean,
): boolean => {
  if (isBetaEnabled() && isAuthenticated) return true;
  return canAccess(userTier, requiredTier);
};
