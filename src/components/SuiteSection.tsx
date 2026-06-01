import type { ImmersiveKitApp, AppSuite, UserTier } from '../types';
import AppGrid from './AppGrid';

const accentConfig: Record<AppSuite, { bar: string; eyebrow: string; border: string }> = {
  design: {
    bar: 'bg-cyan-500',
    eyebrow: 'text-cyan-400',
    border: 'border-l-cyan-500/50',
  },
  operations: {
    bar: 'bg-emerald-500',
    eyebrow: 'text-emerald-400',
    border: 'border-l-emerald-500/50',
  },
  marketing: {
    bar: 'bg-amber-500',
    eyebrow: 'text-amber-400',
    border: 'border-l-amber-500/50',
  },
};

interface Props {
  suite: AppSuite;
  title: string;
  eyebrow: string;
  description: string;
  apps: ImmersiveKitApp[];
  userTier: UserTier;
}

export default function SuiteSection({ suite, title, eyebrow, description, apps, userTier }: Props) {
  const { bar, eyebrow: eyebrowColor, border } = accentConfig[suite];

  return (
    <section>
      <div className={`flex items-start gap-4 mb-6 pl-4 border-l-2 ${border}`}>
        <div>
          <p className={`text-xs font-semibold tracking-widest uppercase mb-1 ${eyebrowColor}`}>
            {eyebrow}
          </p>
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">{description}</p>
        </div>
        <div className={`hidden sm:block flex-shrink-0 mt-2 w-0.5 h-8 ${bar} rounded-full opacity-50`} />
      </div>
      <AppGrid apps={apps} userTier={userTier} />
    </section>
  );
}
