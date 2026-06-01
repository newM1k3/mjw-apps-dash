import { Navigate } from 'react-router-dom';
import { usePocketBase } from '../hooks/usePocketBase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = usePocketBase();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">Loading ImmersiveKit...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
