/**
 * Beta all-access feature flag.
 *
 * When BETA_ALL_ACCESS is true, signed-in users can launch all 15 tools
 * regardless of their subscription tier. The original tier model is preserved
 * in src/data/apps.ts — this flag only gates the access-control check.
 *
 * TO DISABLE BETA MODE after testing:
 *   Set VITE_ENABLE_BETA_ALL_ACCESS=false in your deployment environment,
 *   OR change the fallback literal below from `true` to `false` and redeploy.
 *
 * The string comparison handles both the env var being absent (undefined)
 * and being explicitly set to "false".
 */
export const BETA_ALL_ACCESS: boolean =
  import.meta.env.VITE_ENABLE_BETA_ALL_ACCESS !== 'false';

export function isBetaEnabled(): boolean {
  return BETA_ALL_ACCESS;
}
