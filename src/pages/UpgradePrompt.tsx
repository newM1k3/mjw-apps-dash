import { useSearchParams, useNavigate } from 'react-router-dom';
import { apps } from '../data/apps';
import { usePocketBase } from '../hooks/usePocketBase';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';

const stripeUrl = import.meta.env.VITE_STRIPE_UPGRADE_URL;
const upgradeHref = stripeUrl || 'mailto:info@mjwdesign.ca?subject=ImmersiveKit%20Upgrade';

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free forever',
    description: 'Explore lead-gen and concept tools. A starting point for operators evaluating ImmersiveKit.',
    features: [
      'Escape Room Puzzle Flow Visualizer',
      'Marketing Playbook Generator',
      'Marketing Audit Tool',
      'Locked tool previews with upgrade CTAs',
    ],
    cta: 'Current plan',
    ctaHref: null,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Talk to us',
    description: 'Unlock the core operating toolkit for active escape room owners.',
    features: [
      'Everything in Free',
      'Lock Mapping Studio',
      'Puzzle Dependency Auditor',
      'AI Escape Room Generator',
      'RoomReady Ops',
      'GM Script Library',
      'Review Scorecard Analyzer',
      'Seasonal Campaign Builder',
      'Schema Markup Generator',
    ],
    cta: 'Upgrade to Pro',
    ctaHref: upgradeHref,
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Contact us',
    description: 'Unlock advanced production, profitability, and multi-location planning tools.',
    features: [
      'Everything in Pro',
      'Room Layout Risk Mapper',
      'Immersive Production Bible Builder',
      'Party Profit Planner',
      'Content OS — Mastermind Add-on',
      'Priority support',
      'Team accounts',
    ],
    cta: 'Contact for Enterprise',
    ctaHref: 'mailto:info@mjwdesign.ca?subject=ImmersiveKit%20Enterprise',
    highlight: false,
  },
];

export default function UpgradePrompt() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { tier } = usePocketBase();
  const toolId = params.get('tool');

  const triggeredTool = toolId ? apps.find((a) => a.id === toolId) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-amber-500/4 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {triggeredTool && (
          <div className="mb-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <p className="text-amber-400 text-sm">
              <span className="font-semibold">{triggeredTool.name}</span> requires a{' '}
              <span className="capitalize font-semibold">{triggeredTool.requiredTier}</span> plan.
              Upgrade below to unlock it.
            </p>
          </div>
        )}

        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2">
            Plans & Pricing
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Pick the right plan for your operation
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Every ImmersiveKit plan unlocks a structured layer of the operating system for escape room businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {tiers.map((t) => {
            const isCurrent = tier === t.id;
            return (
              <div
                key={t.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  t.highlight
                    ? 'border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-0.5">{t.name}</h3>
                  <p className="text-sm text-amber-400 font-semibold">{t.price}</p>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-5">{t.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-500 text-sm text-center font-medium">
                    Current plan
                  </div>
                ) : t.ctaHref ? (
                  <a
                    href={t.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                      t.highlight
                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    {t.cta}
                  </a>
                ) : (
                  <div className="py-2.5 px-4 rounded-xl border border-slate-800 text-slate-600 text-sm text-center">
                    {t.cta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
