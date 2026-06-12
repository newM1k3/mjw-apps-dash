# ImmersiveKit — Domains, DNS & Email

How `immersivekit.ca` is wired. **DNS is on Netlify DNS** (authoritative — registrar
nameservers point to NS1: `dns1–4.p02.nsone.net`). Tools are hosted on **Netlify**.
The old HostPapa/cPanel zone is **dead** — do not edit it; all changes go in the
Netlify DNS panel.

---

## Current state

- **Apex** `immersivekit.ca` → Netlify (`A 75.2.60.5`). ✓
- **Dashboard** `www.immersivekit.ca` → `apps-dash-board.netlify.app`. ✓
- **Schema tool** `schema.immersivekit.ca` (+ `www.schema`) → `schema-markup-gen.netlify.app`, wildcard Let's Encrypt cert. ✓
- **Freebies (funnel, not dashboard tools):** `audit.immersivekit.ca` →
  `geo-audit-tool.netlify.app`, `roast.immersivekit.ca` → `roast-my-site.netlify.app`.
  Both on Netlify. ✓
- **Email auth records:** none in the zone yet (see Email section) — still to add.

---

## Subdomain scheme (single word per tool)

Each dashboard tool resolves its launch URL from a `VITE_*_URL` env var
(`src/config/toolUrls.ts`); point that var at the subdomain once the tool is live.

| Subdomain | Tool | Dashboard env var | Host now |
|---|---|---|---|
| `setup` | Venue Intelligence Wizard | `VITE_VENUE_INTELLIGENCE_WIZARD_URL` | Netlify — ready |
| `schema` | Schema Markup Generator | `VITE_SCHEMA_MARKUP_GENERATOR_URL` | **Netlify — live** |
| `flow` | Puzzle Flow Visualizer | `VITE_PUZZLE_FLOW_VISUALIZER_URL` | Netlify |
| `roomgen` | AI Escape Room Generator | `VITE_AI_ESCAPE_ROOM_GENERATOR_URL` | Netlify |
| `roomready` | RoomReady Ops | `VITE_ROOMREADY_OPS_URL` | Netlify |
| `lockmap` | Lock Mapping Studio | `VITE_LOCK_MAPPING_STUDIO_URL` | Bolt → migrate |
| `puzzleaudit` | Puzzle Dependency Auditor | `VITE_PUZZLE_DEPENDENCY_AUDITOR_URL` | Bolt → migrate |
| `layout` | Room Layout Risk Mapper | `VITE_ROOM_LAYOUT_RISK_MAPPER_URL` | Bolt → migrate |
| `blueprint` | Immersive Production Blueprint Builder | `VITE_PRODUCTION_BLUEPRINT_BUILDER_URL` | Bolt → migrate |
| `scripts` | GM Script Library | `VITE_GM_SCRIPT_LIBRARY_URL` | Bolt → migrate |
| `parties` | Party Profit Planner | `VITE_PARTY_PROFIT_PLANNER_URL` | Bolt → migrate |
| `playbook` | Marketing Playbook Generator | `VITE_MARKETING_PLAYBOOK_GENERATOR_URL` | Bolt → migrate |
| `mktaudit` | Marketing Audit Tool | `VITE_MARKETING_AUDIT_TOOL_URL` | Bolt → migrate |
| `reviews` | Review Scorecard Analyzer | `VITE_REVIEW_SCORECARD_ANALYZER_URL` | Bolt → migrate |
| `campaigns` | Seasonal Campaign Builder | `VITE_SEASONAL_CAMPAIGN_BUILDER_URL` | Bolt → migrate |
| `mastermind` | Content OS — Mastermind | `VITE_CONTENT_OS_MASTERMIND_URL` | none yet |

> `audit` is the live GEO Audit **freebie** — not the dashboard's Marketing Audit
> Tool, which uses `mktaudit`. `blueprint` replaces the retired "Bible" naming.

---

## Per-tool workflow (Netlify DNS makes this short)

Because the domain is on Netlify DNS, adding a custom domain to a Netlify site
auto-creates the DNS record **and** provisions SSL. Per tool:

1. **Deploy the tool to Netlify** (import its GitHub repo) — skip if already there.
2. **Netlify site → Domain management → Add domain** `<sub>.immersivekit.ca`.
   Netlify writes the DNS record and issues the cert automatically. No manual
   CNAME, no cert wait, no cPanel steps.
3. **Point the dashboard at it:** set the tool's `VITE_*_URL` to
   `https://<sub>.immersivekit.ca` in the dashboard's Netlify env vars, redeploy.

That's the whole recipe. The 10 Bolt-hosted tools just need step 1 first.

### For a non-Netlify host

Add the record manually in Netlify DNS — an `A` record to the host's IP, or a
`CNAME` to its hostname.

---

## Email

**Receiving:** none. `mjwdesign@gmail.com` is the inbox; there is **no `MX` record**
and no `@immersivekit.ca` mailbox by choice.

**Sending** is split across two services — add each one's DNS records (from their
domain-verification screens) into Netlify DNS:

- **EmailIt** — transactional/app email (password resets, wizard emails, notifications)
  via SMTP/API.
- **SendFox** — newsletters / marketing campaigns.

If **both** send as `@immersivekit.ca`:

- **SPF:** only one `TXT` allowed — merge both services' `include:` mechanisms into a
  single SPF record.
- **DKIM:** fine to have several — each service uses its own selector.
- **DMARC:** one `_dmarc` `TXT` record total.

(The old HostPapa mail records — cPanel `MX`, `_mailchannels`, the HostPapa SPF/DKIM —
are obsolete. Do not recreate them.)

---

## Notes

- Don't touch the registrar nameservers (`*.p02.nsone.net`) or the apex/`www` records —
  the dashboard depends on them.
- The old cPanel DNS zone still exists at HostPapa but is **not authoritative**; ignore it.
- Lower a record's TTL to ~300s temporarily if you want fast propagation while testing.
