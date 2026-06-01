import type { ImmersiveKitApp, UserTier } from '../types';
import AppCard from './AppCard';

interface Props {
  apps: ImmersiveKitApp[];
  userTier: UserTier;
  isAuthenticated: boolean;
}

export default function AppGrid({ apps, userTier, isAuthenticated }: Props) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p>No tools match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} userTier={userTier} isAuthenticated={isAuthenticated} />
      ))}
    </div>
  );
}
