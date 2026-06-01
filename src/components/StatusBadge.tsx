import type { AppStatus } from '../types';

const config: Record<AppStatus, { label: string; dot: string; classes: string }> = {
  live_or_ready: {
    label: 'Live',
    dot: 'bg-emerald-400',
    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  },
  planned: {
    label: 'Planned',
    dot: 'bg-slate-400',
    classes: 'bg-slate-700/50 text-slate-400 border border-slate-600/40',
  },
  coming_soon: {
    label: 'Coming Soon',
    dot: 'bg-amber-400',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  },
};

export default function StatusBadge({ status }: { status: AppStatus }) {
  const { label, dot, classes } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
