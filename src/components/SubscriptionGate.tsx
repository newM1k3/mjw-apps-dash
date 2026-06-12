import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { UserTier } from '../types';

interface Props {
  userTier: UserTier;
}

export default function SubscriptionGate({ userTier }: Props) {
  const navigate = useNavigate();

  if (userTier === 'enterprise') return null;

  const stripeUrl = import.meta.env.VITE_STRIPE_UPGRADE_URL;
  const upgradeHref = stripeUrl || 'mailto:info@mjwdesign.ca?subject=ImmersiveKit%20Upgrade';

  return (
    <div className="mt-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-400 mb-2">
          Upgrade your plan
        </p>
        <h3 className="text-2xl font-bold text-white mb-3">
          {userTier === 'free'
            ? 'Unlock the full ImmersiveKit operating system'
            : 'Unlock advanced production and profitability tools'}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {userTier === 'free'
            ? 'Pro gives you the core toolkit used by active escape room owners — room ops, GM scripts, lock mapping, puzzle auditing, and marketing analysis.'
            : 'Enterprise unlocks advanced layout risk mapping, production blueprints, party profit modeling, and the Content OS Mastermind add-on.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={upgradeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            {userTier === 'free' ? 'Upgrade to Pro' : 'Upgrade to Enterprise'}
          </a>
          <button
            onClick={() => navigate('/upgrade')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-600 hover:text-white transition-colors"
          >
            Compare plans
          </button>
        </div>
      </div>
    </div>
  );
}
