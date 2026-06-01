# Platform Gateway — Future Integration

This document describes the planned MJW Global Auth & Credits Gateway and explains what has been prepared in the dashboard codebase to support it.

---

## What is the Platform Gateway?

The Platform Gateway is a future centralised service (tentatively at `auth.mjw.app`) that will unify identity, subscription status, and AI credit balances across all MJW tools. Instead of each tool maintaining its own PocketBase auth, a single gateway token would carry everything a tool needs to know about the current user.

Planned gateway capabilities:

| Capability | Description |
|---|---|
| Centralised login | One sign-in flow across all MJW tools |
| Stripe subscription status | `active`, `trialing`, `past_due`, `canceled` — live from Stripe |
| AI credit balance | Remaining credits for AI-powered features across the suite |
| Cross-app access control | Tier and feature flags served from one source of truth |
| Token issuance & expiry | Short-lived tokens with `issuedAt` / `expiresAt` for security |

---

## Current production auth

**The dashboard uses PocketBase today.** Nothing about the current login, session management, or tier-gating has changed. PocketBase remains the only backend.

The gateway abstraction layer added in `src/lib/platformGateway.ts` is a forward-looking stub — no network calls are made to any gateway by default.

---

## What was added to the codebase

### `src/lib/platformGateway.ts`

Defines the TypeScript interface for a future gateway session response:

```typescript
interface PlatformGatewaySession {
  userId: string;
  email: string;
  tier: UserTier;                   // 'free' | 'pro' | 'enterprise'
  aiCreditsRemaining: number;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  issuedAt: string;                 // ISO 8601
  expiresAt: string;                // ISO 8601
}
```

Two helper functions:

- `isGatewayEnabled(): boolean` — returns `true` only when `VITE_PLATFORM_GATEWAY_URL` is set to a valid http/https URL. Used as a feature flag.
- `getGatewayUrl(): string | null` — returns the configured gateway base URL, or `null`.

### `.env.example`

`VITE_PLATFORM_GATEWAY_URL` is documented as an optional, future-only variable. It is blank in the example and should remain unset in all current production deployments.

---

## How future integration will work

When the gateway is ready, the integration path is:

1. Set `VITE_PLATFORM_GATEWAY_URL=https://auth.mjw.app` in Netlify environment variables.
2. `isGatewayEnabled()` will return `true`.
3. A new `useGatewaySession()` hook (not yet built) will call `GET /session` on the gateway URL with the PocketBase token as a Bearer credential.
4. The gateway returns a `PlatformGatewaySession` object.
5. `usePocketBase` (or a successor hook) maps `PlatformGatewaySession.tier` through `normalizeTier()` — the same normalisation already in `src/lib/user.ts` — so the rest of the UI is unchanged.
6. AI credit balances surface on tool cards and the stat bar.
7. PocketBase can be retired from the auth flow once the gateway is stable, or kept as a fallback.

The dashboard can support both paths simultaneously during migration by checking `isGatewayEnabled()` at the top of the auth hook and branching.

---

## What was intentionally not built

- No `useGatewaySession()` hook.
- No fetch call to `VITE_PLATFORM_GATEWAY_URL`.
- No token exchange between PocketBase and the gateway.
- No AI credits UI.
- No changes to the current login, logout, or SSO launch flow.
- No new network requests on any code path.

The current dashboard will continue to work identically whether or not `VITE_PLATFORM_GATEWAY_URL` is set.

---

## Testing the feature flag

To verify the feature flag without a real gateway:

```bash
# In .env (local only — never commit real URLs)
VITE_PLATFORM_GATEWAY_URL=http://localhost:9000

# In browser console after loading the dashboard:
# Import is not possible from console, but you can verify the build
# includes the flag by checking src/lib/platformGateway.ts compiles cleanly.
npm run typecheck
```

The flag returning `true` has no observable effect on the UI until gateway-consuming code is added.
