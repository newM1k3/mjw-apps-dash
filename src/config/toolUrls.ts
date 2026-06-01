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
  'lock-mapping-studio':               'https://lockmap-studio-u8m3.bolt.host',
  'puzzle-dependency-auditor':         'https://puzzle-dependency-au-7azs.bolt.host',
  'room-layout-risk-mapper':           'https://layout-risk-mapper.bolt.host',
  'puzzle-flow-visualizer':            'https://puzzle-flow-build.netlify.app/',
  'immersive-production-bible-builder':'https://mjw-immersive-produc-be4v.bolt.host',
  'ai-escape-room-generator':          'https://ai-escape-room-generator.netlify.app/',

  // Operations Suite
  'roomready-ops':                     'https://room-ready-ops.netlify.app/',
  'gm-script-library':                 'https://9t009kgmnt6mzpko8bod1bhfm.bolt.host',
  'party-profit-planner':              'https://party-profit-planner-321a.bolt.host',

  // Marketing Suite
  'escape-room-marketing-playbook-generator': 'https://mjw-escape-room-play-ca5k.bolt.host',
  'escape-room-marketing-audit-tool':         'https://escape-room-marketin-gyv2.bolt.host',
  'review-scorecard-analyzer':                'https://reviewscorecard-io-m-wtat.bolt.host',
  'seasonal-campaign-builder':                'https://campaign-builder-sea-3t1g.bolt.host',
  'schema-markup-generator':                  'https://local-seo-schema-gen-nn3b.bolt.host',

  // No temporary URL available yet — leave blank until a real URL is supplied.
  'content-os-mastermind-addon':       '',
};

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
