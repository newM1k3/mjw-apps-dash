# ImmersiveKit App Ecosystem Dashboard

The central hub for the ImmersiveKit product suite — 15 tools organised across three suites that cover the full lifecycle of an escape-room business, from room design and daily operations through to marketing and revenue growth.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS, lucide-react |
| Auth & data | PocketBase (`pocketbase` SDK) |
| Hosting | Netlify (static + SPA redirects) |
| Routing | react-router-dom v7 |

No Supabase, Firebase, Prisma, or custom server. PocketBase is the only backend.

The dashboard is gateway-ready: `src/lib/platformGateway.ts` defines the TypeScript interface for a future MJW Global Auth & Credits Gateway and a feature-flag helper (`isGatewayEnabled()`), but no gateway calls are made in production. See [docs/PLATFORM_GATEWAY_FUTURE.md](docs/PLATFORM_GATEWAY_FUTURE.md).

## Product structure

Tools are organised into three suites:

| Suite | Purpose |
|---|---|
| **Design Suite** | Plan rooms before construction starts — lock mapping, puzzle flow, risk mapping, production blueprints, AI concept generation. |
| **Operations Suite** | Keep rooms running — daily readiness, GM scripts, party profit modelling. |
| **Marketing Suite** | Fill seats — playbooks, audits, review analysis, seasonal campaigns, schema markup, copy critique. |

## Subscription tiers

The dashboard reads `users.tier` from PocketBase and gates tool access accordingly.

| Tier | Access |
|---|---|
| `free` | Free-tier tools only. Locked tools remain visible with upgrade CTAs. |
| `pro` | Free + Pro tools. Enterprise tools shown as upgrade opportunities. |
| `enterprise` | All 15 tools. |

Unknown or missing tier values normalise to `free`.

## Local development

```bash
# 1. Copy environment variables
cp .env.example .env
# Edit .env — set VITE_POCKETBASE_URL at minimum

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Other useful commands:

```bash
npm run typecheck   # TypeScript type-checking (no emit)
npm run lint        # ESLint
npm run build       # Production build into dist/
npm run preview     # Preview the production build locally
```

## Environment variables

Copy `.env.example` to `.env` and fill in values. Only `VITE_POCKETBASE_URL` is required; all tool URLs are optional and degrade gracefully to a "Coming Soon" state when absent.

See `.env.example` for the full variable list with descriptions.

## PocketBase assumptions

The dashboard authenticates against a PocketBase `users` collection. See `docs/POCKETBASE_SCHEMA.md` for the expected fields.

Users are created and managed directly in the PocketBase admin UI. The dashboard does not provide a registration flow — operators are provisioned manually or through a separate onboarding process.

## SSO launch behaviour

When a user clicks **Launch Tool** the dashboard appends the current PocketBase auth token to the target URL as query parameters (`?token=...&uid=...`) before redirecting. See `docs/SSO_HANDOFF.md` for how receiving apps should handle this.

## SPA routing

The file `public/_redirects` contains:

```
/* /index.html 200
```

This is required for Netlify to serve the React SPA correctly on direct URL access and page refresh. Do not remove it.

## Temporary Tool URLs

14 of the 15 tools have temporary launch URLs pointing to Bolt / Netlify preview deployments. These are defined in `src/config/toolUrls.ts` and serve as fallbacks until permanent production domains are configured.

URL resolution order:

1. **Permanent environment variable** (`VITE_*_URL`) — always takes priority. Set this in Netlify to switch a tool to its permanent domain with no code change.
2. **Temporary fallback** (`src/config/toolUrls.ts`) — used when no env var is set.
3. **Empty** — card renders in "URL Not Configured" disabled state.

`Content OS — Mastermind Add-on` currently has no temporary URL and will show as not configured until one is supplied.

Tier gating is not bypassed by temporary URLs. Locked tools still route to `/upgrade` regardless of whether a URL exists.

See `src/config/toolUrls.ts` to review or update the temporary URL mapping.

## Deployment

See **[docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)** for the full step-by-step Netlify deployment guide, including environment variable reference, PocketBase CORS setup, and post-deploy smoke tests.

Quick summary:

1. Push to GitHub and connect to a Netlify site.
2. `netlify.toml` sets `npm run build` and `dist` automatically — no manual build settings needed.
3. Set `VITE_POCKETBASE_URL` in Netlify environment variables (required).
4. Add tool URL variables as each tool goes live — no code changes needed.
5. `public/_redirects` handles SPA routing; do not add a conflicting `[[redirects]]` block in `netlify.toml`.

## Changelog

See **[CHANGELOG.md](CHANGELOG.md)** for release history.

## File structure

```
src/
├── components/       UI components (AppCard, AppGrid, SuiteSection, etc.)
├── config/
│   └── toolUrls.ts   Temporary URL map + getToolUrl resolver
├── data/apps.ts      Hardcoded 15-tool catalogue
├── hooks/            usePocketBase auth hook
├── lib/              pocketbase client, access helper, SSO helper, tier normaliser, gateway stub
├── pages/            Login, Dashboard, UpgradePrompt
└── types/index.ts    Shared TypeScript types
docs/
├── SSO_HANDOFF.md
├── POCKETBASE_SCHEMA.md
├── DEPLOYMENT_CHECKLIST.md
└── PLATFORM_GATEWAY_FUTURE.md
public/
└── _redirects        Netlify SPA redirect rule
netlify.toml          Netlify build configuration
CHANGELOG.md          Release history
```
