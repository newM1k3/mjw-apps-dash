import type { UserTier } from '../types';

const config: Record<UserTier, { label: string; classes: string }> = {
  free: {
    label: 'Free',
    classes: 'bg-slate-700 text-slate-300 border border-slate-600',
  },
  pro: {
    label: 'Pro',
    classes: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
  },
  enterprise: {
    label: 'Enterprise',
    classes: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
  },
};

export default function TierBadge({ tier }: { tier: UserTier }) {
  const { label, classes } = config[tier];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${classes}`}>
      {label}
    </span>
  );
}
