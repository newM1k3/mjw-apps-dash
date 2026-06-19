/**
 * Temporary ImmersiveKit tool URLs.
 *
 * These URLs point to Bolt / Netlify preview deployments and are TRANSITIONAL.
 * They exist only until permanent production domains are available.
 *
 * Resolution order (see getToolUrl):
 *   1. Permanent environment variable (VITE_*_URL) — always wins.
 *   2. Temporary fallback below — used when no env var is set.
 *   3. Empty string — renders the card in its "URL Not Configured" state.
 *
 * To remove a temporary URL once a permanent one is deployed:
 *   1. Set the corresponding VITE_*_URL in your deployment environment.
 *   2. The env var will automatically take precedence; no code change needed.
 *   3. Optionally blank-out the entry below to keep this file clean.
 */
export const temporaryToolUrls: Record<string, string> = {
  // Design Suite
  'lock-mapping-studio':                        'https://lock-map-studio.netlify.app',
  'puzzle-dependency-auditor':                  'https://puzzle-auditor.netlify.app',
  'room-layout-risk-mapper':                    'https://layout.immersivekit.ca',
  'puzzle-flow-visualizer':                     'https://puzzle-flow-build.netlify.app',
  'immersive-production-bible-builder':         'https://immersive-product-builder.netlify.app',
  'ai-escape-room-generator':                   'https://ai-escape-room-generator.netlify.app',

  // Operations Suite
  'roomready-ops':                              'https://room-ready-ops.netlify.app',
  'gm-script-library':                          'https://gm-script-library.netlify.app',
  'party-profit-planner':                       'https://party-profit-planner.netlify.app',
  'corporate-proposal-generator':               'https://corporate-proposal-genr8or.netlify.app',

  // Marketing Suite
  'escape-room-marketing-playbook-generator':   'https://marketing-playbook-generator.netlify.app',
  'escape-room-marketing-audit-tool':           'https://marketing-audit-tool.netlify.app',
  'review-scorecard-analyzer':                  'https://review-scorecard-analyzer.netlify.app',
  'seasonal-campaign-builder':                  'https://seasonal-campaign-builder.netlify.app',
  'schema-markup-generator':                    'https://schema-markup-gen.netlify.app',
  'content-os-mastermind-addon':                'https://mastermind-content-addon.netlify.app',
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
 * @returns       The permanent URL if set, the temporary fallback if available, or ''.
 */
export function getToolUrl(appId: string, envUrl?: string): string {
  const permanent = envUrl?.trim();
  if (permanent) return permanent;

  const temporary = temporaryToolUrls[appId]?.trim();
  if (temporary) return temporary;

  return '';
}
