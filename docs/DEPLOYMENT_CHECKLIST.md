# Deployment Checklist

Use this checklist every time you deploy ImmersiveKit Dashboard to Netlify — whether it is the first time or an update.

---

## 1. Repository setup

- [ ] Code is pushed to a GitHub repository (or GitLab / Bitbucket if preferred).
- [ ] The repository is connected to a Netlify site (New site → Import from Git).

---

## 2. Netlify build settings

Netlify reads these from `netlify.toml` automatically. Confirm they are set correctly in **Site settings → Build & deploy → Build settings**:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `20` (set in `netlify.toml` via `NODE_VERSION`) |

> These values are already declared in `netlify.toml`. You should not need to change them manually in the Netlify UI.

---

## 3. SPA routing

The file `public/_redirects` contains the catch-all rule:

```
/* /index.html 200
```

`netlify.toml` does **not** duplicate this redirect, so there is no conflict. Do not remove `public/_redirects` and do not add a `[[redirects]]` block to `netlify.toml` — the two sources would be merged and could create duplicate rules.

Confirm after deploy: navigate to `/dashboard` directly in the browser (without clicking a link). The page should load correctly instead of returning a 404.

---

## 4. Environment variables

Set all variables in **Netlify → Site settings → Environment variables**. Variables prefixed `VITE_` are embedded at build time — any change requires a new deploy.

### Required

| Variable | Description |
|---|---|
| `VITE_POCKETBASE_URL` | Full URL of the PocketBase instance, e.g. `https://your-instance.pockethost.io`. No trailing slash. |

### Optional — upgrade flow

| Variable | Description |
|---|---|
| `VITE_STRIPE_UPGRADE_URL` | Stripe payment / checkout link shown in upgrade CTAs. If absent, upgrade CTAs fall back to the `mailto:` address in `SubscriptionGate.tsx`. |

### Optional — tool URLs (one per tool)

Add these as tools go live. A missing variable renders the card with a disabled "Coming Soon" button — no code changes needed.

| Variable | Tool |
|---|---|
| `VITE_LOCK_MAPPING_STUDIO_URL` | Lock Mapping Studio |
| `VITE_PUZZLE_DEPENDENCY_AUDITOR_URL` | Puzzle Dependency Auditor |
| `VITE_ROOM_LAYOUT_RISK_MAPPER_URL` | Room Layout Risk Mapper |
| `VITE_PUZZLE_FLOW_VISUALIZER_URL` | Escape Room Puzzle Flow Visualizer |
| `VITE_PRODUCTION_BLUEPRINT_BUILDER_URL` | Immersive Production Blueprint Builder |
| `VITE_AI_ESCAPE_ROOM_GENERATOR_URL` | AI Escape Room Generator |
| `VITE_ROOMREADY_OPS_URL` | RoomReady Ops |
| `VITE_GM_SCRIPT_LIBRARY_URL` | GM Script Library |
| `VITE_PARTY_PROFIT_PLANNER_URL` | Party Profit Planner |
| `VITE_MARKETING_PLAYBOOK_GENERATOR_URL` | Escape Room Marketing Playbook Generator |
| `VITE_MARKETING_AUDIT_TOOL_URL` | Escape Room Marketing Audit Tool |
| `VITE_REVIEW_SCORECARD_ANALYZER_URL` | Review Scorecard Analyzer |
| `VITE_SEASONAL_CAMPAIGN_BUILDER_URL` | Seasonal Campaign Builder |
| `VITE_SCHEMA_MARKUP_GENERATOR_URL` | Schema Markup Generator |
| `VITE_CONTENT_OS_MASTERMIND_URL` | Content OS — Mastermind Add-on |

> **Temporary URL fallbacks:** 14 of the 15 tools have temporary launch URLs built into `src/config/toolUrls.ts`. These are active by default — you do not need to set any `VITE_*_URL` variable to make those tools launchable right now. Setting a `VITE_*_URL` variable overrides the temporary fallback for that tool. Before final production launch, replace all temporary fallbacks with permanent URLs via environment variables.

---

## 5. Replacing temporary URLs with permanent ones (pre-production checklist)

14 tools currently launch from temporary Bolt / Netlify preview URLs. These must be replaced before the platform is considered fully production-grade:

- [ ] Set `VITE_LOCK_MAPPING_STUDIO_URL` to the permanent domain.
- [ ] Set `VITE_PUZZLE_DEPENDENCY_AUDITOR_URL` to the permanent domain.
- [ ] Set `VITE_ROOM_LAYOUT_RISK_MAPPER_URL` to the permanent domain.
- [ ] Set `VITE_PUZZLE_FLOW_VISUALIZER_URL` to the permanent domain.
- [ ] Set `VITE_PRODUCTION_BLUEPRINT_BUILDER_URL` to the permanent domain.
- [ ] Set `VITE_AI_ESCAPE_ROOM_GENERATOR_URL` to the permanent domain.
- [ ] Set `VITE_ROOMREADY_OPS_URL` to the permanent domain.
- [ ] Set `VITE_GM_SCRIPT_LIBRARY_URL` to the permanent domain.
- [ ] Set `VITE_PARTY_PROFIT_PLANNER_URL` to the permanent domain.
- [ ] Set `VITE_MARKETING_PLAYBOOK_GENERATOR_URL` to the permanent domain.
- [ ] Set `VITE_MARKETING_AUDIT_TOOL_URL` to the permanent domain.
- [ ] Set `VITE_REVIEW_SCORECARD_ANALYZER_URL` to the permanent domain.
- [ ] Set `VITE_SEASONAL_CAMPAIGN_BUILDER_URL` to the permanent domain.
- [ ] Set `VITE_SCHEMA_MARKUP_GENERATOR_URL` to the permanent domain.
- [ ] Supply a URL for `Content OS — Mastermind Add-on` (currently no temporary URL; set `VITE_CONTENT_OS_MASTERMIND_URL` or add a temporary URL in `src/config/toolUrls.ts`).

Each `VITE_*_URL` set in Netlify automatically overrides the temporary fallback with no code change required.

---

## 6. PocketBase setup

- [ ] A PocketBase instance is running and accessible at the URL set in `VITE_POCKETBASE_URL`.
- [ ] The `users` collection has a custom `tier` field (plain text, default `free`). See `docs/POCKETBASE_SCHEMA.md`.
- [ ] At least one user account exists for smoke testing.
- [ ] At least one account per tier (`free`, `pro`, `enterprise`) exists if you want to test tier gating.
- [ ] PocketBase CORS is configured to allow requests from your Netlify domain.

### Configuring PocketBase CORS

In the PocketBase admin UI go to **Settings → Application** and add your Netlify domain to the allowed origins list (e.g. `https://your-site.netlify.app` and your custom domain if applicable).

---

## 7. Triggering the first deploy

1. Push your branch to the connected repository.
2. Netlify detects the push and runs `npm run build`.
3. On success the site is published to `dist/`.
4. Check the Netlify deploy log for errors. Common issues:
   - Missing `VITE_POCKETBASE_URL` (the app still builds, but the dev-mode warning banner will not appear in production — set the variable before testing).
   - TypeScript or ESLint errors (run `npm run typecheck && npm run lint` locally before pushing).

---

## 8. Post-deploy smoke tests

Run these manually after every deploy that touches auth, routing, or environment variables.

| Test | Steps | Expected result |
|---|---|---|
| Login page renders | Navigate to `https://your-site.netlify.app/login` | Login form visible, no blank page or 404 |
| Successful login | Sign in with a valid `free` user | Redirected to `/dashboard`, user email and "Free" badge visible in header |
| Dashboard SPA route | Navigate directly to `https://your-site.netlify.app/dashboard` (no prior login) | Redirected to `/login` (AuthGuard) — not a 404 |
| Locked tool route | Click **Upgrade to Unlock** on any locked tool | Navigated to `/upgrade?tool=<id>`, upgrade page renders |
| Upgrade route direct | Navigate directly to `https://your-site.netlify.app/upgrade` | Upgrade prompt renders — not a 404 |
| Tier gating — free user | Sign in as `free` user | Pro/Enterprise tools show amber lock icon and "Upgrade to Unlock" button |
| Tier gating — pro user | Sign in as `pro` user | Pro tools launchable, Enterprise tools locked |
| Tier gating — enterprise user | Sign in as `enterprise` user | All tools accessible, "Locked by Plan" stat shows 0 |
| Live tool launch | Click **Launch Tool** on a configured, accessible tool | Redirected to the tool URL with `?token=...&uid=...&source=mjw-apps-dash` appended |
| SSO token handoff | Inspect the redirect URL on a live tool launch | `token`, `uid`, and `source=mjw-apps-dash` query params are present |
| Sign out | Click **Sign out** in the header | Returned to `/login`, session cleared |

---

## 9. Adding a new tool URL after launch

1. Add `VITE_<TOOL_NAME>_URL=https://your-tool.example.com` in **Netlify → Environment variables**.
2. Trigger a new deploy (push a commit, or use **Deploys → Trigger deploy → Deploy site** in the Netlify UI).
3. Verify the tool card shows **Launch Tool** instead of **Coming Soon**.

No code changes are required to activate a tool URL.
