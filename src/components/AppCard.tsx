import {
  Network, GitBranch, Map, Workflow, BookOpenText, Sparkles,
  ClipboardCheck, FileText, Calculator, Megaphone, Gauge,
  Star, CalendarDays, Code2, Flame, Lock, ExternalLink, ArrowUpRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ImmersiveKitApp, UserTier } from '../types';
import { canAccess } from '../lib/access';
import { redirectWithToken } from '../lib/sso';
import TierBadge from './TierBadge';
import StatusBadge from './StatusBadge';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Network, GitBranch, Map, Workflow, BookOpenText, Sparkles,
  ClipboardCheck, FileText, Calculator, Megaphone, Gauge,
  Star, CalendarDays, Code2, Flame,
};

const suiteAccent: Record<string, string> = {
  design: 'group-hover:border-cyan-500/50 [&_.icon-wrap]:bg-cyan-500/10 [&_.icon-wrap]:text-cyan-400',
  operations: 'group-hover:border-emerald-500/50 [&_.icon-wrap]:bg-emerald-500/10 [&_.icon-wrap]:text-emerald-400',
  marketing: 'group-hover:border-amber-500/50 [&_.icon-wrap]:bg-amber-500/10 [&_.icon-wrap]:text-amber-400',
};

const suiteGlow: Record<string, string> = {
  design: 'shadow-cyan-500/5',
  operations: 'shadow-emerald-500/5',
  marketing: 'shadow-amber-500/5',
};

interface Props {
  app: ImmersiveKitApp;
  userTier: UserTier;
}

export default function AppCard({ app, userTier }: Props) {
  const navigate = useNavigate();
  const Icon = iconMap[app.icon] ?? Network;
  const accessible = canAccess(userTier, app.requiredTier);
  const hasUrl = !!app.url;

  const isLaunchable = accessible && hasUrl && app.status === 'live_or_ready';
  const isLocked = !accessible;

  const accentClass = suiteAccent[app.suite] ?? '';
  const glowClass = suiteGlow[app.suite] ?? '';

  const handleAction = () => {
    if (isLocked) {
      navigate(`/upgrade?tool=${app.id}`);
    } else if (isLaunchable) {
      redirectWithToken(app.url!);
    }
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition-all duration-300 hover:shadow-lg ${glowClass} ${accentClass} ${isLocked ? 'opacity-70' : ''}`}
    >
      {isLocked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="icon-wrap flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <StatusBadge status={app.status} />
            <TierBadge tier={app.requiredTier} />
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug mt-1">{app.name}</h3>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1">{app.description}</p>

      <p className="text-slate-500 text-xs italic mb-4 border-l-2 border-slate-700 pl-2.5 leading-relaxed">
        {app.role}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {app.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-500 border border-slate-700/50">
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={handleAction}
        disabled={!isLocked && !isLaunchable}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
          isLocked
            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 cursor-pointer'
            : isLaunchable
            ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50 cursor-pointer'
            : 'bg-slate-800/50 text-slate-600 border border-slate-700/50 cursor-not-allowed'
        }`}
      >
        {isLocked ? (
          <>
            <ArrowUpRight className="w-4 h-4" />
            Upgrade to Unlock
          </>
        ) : isLaunchable ? (
          <>
            <ExternalLink className="w-4 h-4" />
            Launch Tool
          </>
        ) : (
          'Coming Soon'
        )}
      </button>
    </div>
  );
}
