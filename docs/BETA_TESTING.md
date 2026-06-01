# Beta Testing Guide

This document explains how to enable and disable beta all-access mode, and lists the manual verification steps for beta testers.

---

## What beta all-access does

When beta mode is active, every signed-in user can launch all 15 ImmersiveKit tools from the dashboard, regardless of their subscription tier. The original tier model is preserved in the source data — tier badges still appear on each card so testers understand the production gating plan.

Beta all-access does **not**:
- Bypass authentication. Users must still sign in.
- Remove tier badges from tool cards.
- Delete or modify the upgrade route or subscription comparison UI.
- Change which tier each tool belongs to in the catalogue.

---

## How to enable beta all-access

Beta all-access is **on by default** in this build. The logic is:

```
VITE_ENABLE_BETA_ALL_ACCESS !== 'false'  →  beta ON
VITE_ENABLE_BETA_ALL_ACCESS = 'false'    →  beta OFF (production gating restored)
```

When the variable is absent or set to any value other than `'false'`, beta mode is active.

### In local development

To test with beta mode off, add this to your `.env`:

```
VITE_ENABLE_BETA_ALL_ACCESS=false
```

Restart the dev server. The dashboard will revert to normal tier gating.

### In a Netlify deployment

1. Go to **Site settings → Environment variables** in the Netlify dashboard.
2. Set `VITE_ENABLE_BETA_ALL_ACCESS=false`.
3. Trigger a new deploy (push a commit, or **Deploys → Trigger deploy → Deploy site**).

---

## How to disable beta all-access after testing

Set `VITE_ENABLE_BETA_ALL_ACCESS=false` in your deployment environment and redeploy. No code changes are needed.

The relevant code is in **`src/lib/beta.ts`**. If you want to hard-code the flag off permanently, change the fallback in that file:

```ts
// Change this line:
export const BETA_ALL_ACCESS: boolean =
  import.meta.env.VITE_ENABLE_BETA_ALL_ACCESS !== 'false';

// To this, to disable beta mode without relying on the env var:
export const BETA_ALL_ACCESS = false;
```

---

## Where the beta flag is used

| File | Role |
|---|---|
| `src/lib/beta.ts` | Defines `BETA_ALL_ACCESS` constant and `isBetaEnabled()` helper |
| `src/lib/access.ts` | `canAccessInContext()` checks the flag before falling back to tier comparison |
| `src/components/AppCard.tsx` | Shows "Beta" badge on tier-unlocked cards; uses `canAccessInContext` for button state |
| `src/pages/Dashboard.tsx` | Beta banner at top of page; stat bar shows "Available in Beta" / "Locked During Beta" counts |

---

## SSO launch behaviour during beta

Temporary tool URLs and SSO launch behaviour work the same in beta mode. The `supportsSsoLaunch` field on each tool controls whether the SSO token is appended:

| Tool | `supportsSsoLaunch` | Launch behaviour |
|---|---|---|
| Escape Room Puzzle Flow Visualizer | `true` | URL + `?token=...&uid=...&source=mjw-apps-dash` |
| Escape Room Marketing Audit Tool | `false` | URL only (no SSO params) |
| Escape Room Marketing Playbook Generator | `false` | URL only (no SSO params) |
| All other tools | `false` | URL only (no SSO params) |

---

## Manual verification checklist

Run these steps after each beta deployment to confirm the build is correct.

### Beta mode on

- [ ] Sign in as a user with `free` tier.
- [ ] Confirm the dashboard stat bar shows **15 Available in Beta** and **0 Locked During Beta**.
- [ ] Confirm the teal "Beta access enabled" banner appears at the top of the page.
- [ ] Confirm no tool card shows an "Upgrade to Unlock" button.
- [ ] Confirm Pro and Enterprise tool cards show their original tier badge (e.g. `Pro`, `Enterprise`) alongside a teal `Beta` badge.
- [ ] Confirm Free tools do not show a `Beta` badge (they were always accessible).
- [ ] Confirm all 14 tools with temporary URLs show a **Launch Tool** button.
- [ ] Confirm **Content OS — Mastermind Add-on** shows a **URL Pending** or **Coming Soon** button (no launch URL).
- [ ] Click **Launch Tool** on **Escape Room Puzzle Flow Visualizer** — confirm the redirect URL contains `?token=`, `?uid=`, and `?source=mjw-apps-dash`.
- [ ] Click **Launch Tool** on **Escape Room Marketing Audit Tool** — confirm the redirect URL does NOT contain SSO query parameters.
- [ ] Click **Launch Tool** on **Escape Room Marketing Playbook Generator** — confirm the redirect URL does NOT contain SSO query parameters.
- [ ] Sign out and confirm you are returned to `/login`.

### Beta mode off

- [ ] Set `VITE_ENABLE_BETA_ALL_ACCESS=false` and redeploy (or restart dev server).
- [ ] Sign in as a `free` tier user.
- [ ] Confirm stat bar shows **3 Available to You** and the correct non-zero locked count.
- [ ] Confirm Pro and Enterprise tools show an "Upgrade to Unlock" button.
- [ ] Confirm clicking "Upgrade to Unlock" routes to `/upgrade?tool=<id>`.
- [ ] Confirm the teal beta banner is no longer shown.
- [ ] Confirm no `Beta` badges appear on cards.

---

## Restoring production subscription gating

After beta testing is complete:

1. Set `VITE_ENABLE_BETA_ALL_ACCESS=false` in the Netlify environment variables.
2. Redeploy.
3. Verify the "Beta mode off" checklist above passes.
4. Optionally remove the `VITE_ENABLE_BETA_ALL_ACCESS` variable entirely — when absent, the dashboard will default to beta mode ON again, so either keep it set to `false` or hard-code `BETA_ALL_ACCESS = false` in `src/lib/beta.ts`.
