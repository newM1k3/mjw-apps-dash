import type { UserTier } from '../types';

const VALID_TIERS = new Set<UserTier>(['free', 'pro', 'enterprise']);

export function normalizeTier(tier: unknown): UserTier {
  if (typeof tier === 'string' && VALID_TIERS.has(tier as UserTier)) {
    return tier as UserTier;
  }
  return 'free';
}
