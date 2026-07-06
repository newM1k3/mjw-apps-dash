/**
 * Permanent ImmersiveKit tool URLs (2026-07 suite rebrand).
 *
 * Every tool lives on its permanent *.immersivekit.ca subdomain. These are
 * the production launch URLs; the old lockmap/roomgen/puzzleaudit/… domains
 * were retired when the suite was renamed.
 *
 * Resolution order (see getToolUrl):
 *   1. Environment variable (VITE_*_URL) — an explicit override always wins.
 *   2. Permanent domain below.
 *   3. Empty string — renders the card in its "URL Not Configured" state.
 */
export const permanentToolUrls: Record<string, string> = {
  // Design Suite
  'puzzle-flow-visualizer':                     'https://flow.immersivekit.ca',
  'lock-mapping-studio':                        'https://locks.immersivekit.ca',
  'immersive-production-bible-builder':         'https://blueprint.immersivekit.ca',
  'room-layout-risk-mapper':                    'https://layout.immersivekit.ca',
  'puzzle-dependency-auditor':                  'https://logic.immersivekit.ca',
  'ai-escape-room-generator':                   'https://create.immersivekit.ca',

  // Operations Suite
  'gm-script-library':                          'https://scripts.immersivekit.ca',
  'roomready-ops':                              'https://ready.immersivekit.ca',
  'party-profit-planner':                       'https://profit.immersivekit.ca',

  // Marketing Suite
  'corporate-proposal-generator':               'https://pitch.immersivekit.ca',
  'escape-room-marketing-playbook-generator':   'https://playbook.immersivekit.ca',
  'content-os-mastermind-addon':                'https://content.immersivekit.ca',
  'escape-room-marketing-audit-tool':           'https://audit.immersivekit.ca',
  'review-scorecard-analyzer':                  'https://reviews.immersivekit.ca',
  'seasonal-campaign-builder':                  'https://campaigns.immersivekit.ca',

  // Funnel & SEO Suite
  'geo-audit-tool':                             'https://geo.immersivekit.ca',
  'roast-my-site':                              'https://roast.immersivekit.ca',
  'schema-markup-generator':                    'https://schema.immersivekit.ca',
};

/**
 * Venue Intelligence Wizard — the standalone onboarding app that seeds a venue
 * (organization + project + experiences + membership) before any tool is used.
 * It is NOT a tiered tool, so it lives here rather than in src/data/apps.ts.
 * Resolution: VITE_VENUE_INTELLIGENCE_WIZARD_URL, then the deployed fallback.
 */
export const VENUE_WIZARD_URL: string =
  import.meta.env.VITE_VENUE_INTELLIGENCE_WIZARD_URL?.trim() ||
  'https://venue-intel-wizard.netlify.app';

/**
 * Resolves the launch URL for a tool.
 *
 * @param appId   The tool ID from src/data/apps.ts.
 * @param envUrl  The value of the corresponding VITE_*_URL env var (may be undefined).
 * @returns       The env override if set, the permanent domain if known, or ''.
 */
export function getToolUrl(appId: string, envUrl?: string): string {
  const override = envUrl?.trim();
  if (override) return override;

  const permanent = permanentToolUrls[appId]?.trim();
  if (permanent) return permanent;

  return '';
}
