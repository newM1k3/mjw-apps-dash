import { Sparkles, ArrowRight } from 'lucide-react';
import { redirectWithToken } from '../lib/sso';
import { VENUE_WIZARD_URL } from '../config/toolUrls';

/**
 * First-run onboarding prompt. Shown when a signed-in user has no venue yet.
 * Launches the Venue Intelligence Wizard with the SSO token handoff so the
 * operator lands authenticated.
 */
export default function VenueOnboardingBanner() {
  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900/40 p-6 sm:p-8">
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Set up your venue to get started</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
              Add your website and we'll pre-fill your venue and rooms in about a minute. This seeds
              every ImmersiveKit tool with your data, so you only enter it once.
            </p>
          </div>
        </div>
        <button
          onClick={() => redirectWithToken(VENUE_WIZARD_URL)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
        >
          Set up your venue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
