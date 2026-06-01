# Changelog

All notable changes to the ImmersiveKit Dashboard are recorded here.

---

## [1.0.0] — 2026-06-01

Initial production-ready release of the ImmersiveKit Dashboard.

### Features

- **15-tool catalogue** organised across three suites: Design, Operations, and Marketing.
- **Tier-gated access** — tools are gated to `free`, `pro`, or `enterprise` tiers. Missing or invalid tier values default safely to `free`.
- **PocketBase authentication** — email/password login with friendly error messages that map PocketBase HTTP status codes (400, 403, 429, network failure) to plain-language copy.
- **SSO token handoff** — `buildLaunchUrl` appends `?token=`, `?uid=`, and `?source=mjw-apps-dash` to every launch URL so downstream tools can hydrate their own auth session. Safe URL construction with error handling for invalid URLs.
- **Status filter** — filter tools by All Statuses, Live & Ready, In Development, or Coming Soon. Composes correctly with suite tab and keyword search.
- **Suite tab filter** — All Tools, Design Suite, Operations Suite, Marketing Suite.
- **Keyword search** — searches tool name, description, and tags.
- **Empty state** — polished empty state with Reset Filters button when no tools match the active filters.
- **Stat bar** — Total Tools, Available to You, Live & Ready, and Locked by Plan counters. Available and Locked counts are tier-aware.
- **Per-card button states** — Launch Tool / Upgrade to Unlock / URL Not Configured / In Development / Coming Soon, each with distinct styling and an appropriate icon.
- **Locked card UI** — inaccessible tools show a lock icon, reduced opacity, and route to `/upgrade?tool={id}`.
- **Upgrade prompt page** — `/upgrade` with tool context passed via query string.
- **Dev-mode config banner** — amber warning banner shown only in `import.meta.env.DEV` when `VITE_POCKETBASE_URL` is missing or invalid. Hidden in production builds.
- **Responsive layout** — filters, stat bar, and tool grid all adapt from mobile to desktop.
- **Netlify deployment** — `netlify.toml` with explicit build command and Node version. SPA routing handled by `public/_redirects`.

### Documentation

- `docs/SSO_HANDOFF.md` — token handoff format, receiving-app implementation guide, and security notes.
- `docs/POCKETBASE_SCHEMA.md` — `users` collection schema, valid tier values, and sample records.
- `docs/DEPLOYMENT_CHECKLIST.md` — step-by-step Netlify deployment guide with smoke tests.
