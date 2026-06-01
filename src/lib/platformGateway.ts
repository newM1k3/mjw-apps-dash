/**
 * Platform Gateway — type definitions and readiness check.
 *
 * This file defines the shape of a future MJW Global Auth & Credits Gateway
 * response (e.g. auth.mjw.app). Nothing here is called in the production flow
 * today. The gateway is enabled only when VITE_PLATFORM_GATEWAY_URL is set
 * to a valid URL; otherwise isGatewayEnabled() returns false and PocketBase
 * auth continues unchanged.
 */

import type { UserTier } from '../types';

/** Shape returned by a future gateway /session or /validate endpoint. */
export interface PlatformGatewaySession {
  userId: string;
  email: string;
  tier: UserTier;
  aiCreditsRemaining: number;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  issuedAt: string;   // ISO 8601
  expiresAt: string;  // ISO 8601
}

/**
 * Returns true only when VITE_PLATFORM_GATEWAY_URL is set to a valid http/https URL.
 * Used as a feature flag so gateway code paths can be gated without removing them.
 */
export function isGatewayEnabled(): boolean {
  const url = import.meta.env.VITE_PLATFORM_GATEWAY_URL;
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns the gateway base URL, or null if not configured.
 * Callers must check isGatewayEnabled() before using this value.
 */
export function getGatewayUrl(): string | null {
  const url = import.meta.env.VITE_PLATFORM_GATEWAY_URL;
  return url && typeof url === 'string' && url.trim() !== '' ? url.trim() : null;
}
