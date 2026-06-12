import { useState, useMemo } from 'react';
import { usePocketBase } from '../hooks/usePocketBase';
import { useHasVenue } from '../hooks/useHasVenue';
import { apps, suiteMeta } from '../data/apps';
import SuiteSection from '../components/SuiteSection';
import SubscriptionGate from '../components/SubscriptionGate';
import VenueOnboardingBanner from '../components/VenueOnboardingBanner';
import TierBadge from '../components/TierBadge';
import type { AppSuite, AppStatus } from '../types';
import { canAccess, canAccessInContext } from '../lib/access';
import { isBetaEnabled } from '../lib/beta';
import { Search, LogOut, LayoutGrid, Zap, CheckCircle, Lock, AlertTriangle, FlaskConical } from 'lucide-react';

type FilterTab = 'all' | AppSuite;
type StatusFilter = 'all' | AppStatus;

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'design', label: 'Design Suite' },
  { id: 'operations', label: 'Operations Suite' },
  { id: 'marketing', label: 'Marketing Suite' },
];

const statusOptions: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All Statuses' },
  { id: 'live_or_ready', label: 'Live & Ready' },
  { id: 'planned', label: 'In Development' },
  { id: 'coming_soon', label: 'Coming Soon' },
];

const tabAccent: Record<FilterTab, string> = {
  all: 'data-[active=true]:text-white data-[active=true]:bg-slate-700',
  design: 'data-[active=true]:text-cyan-300 data-[active=true]:bg-cyan-500/10 data-[active=true]:border-cyan-500/30',
  operations: 'data-[active=true]:text-emerald-300 data-[active=true]:bg-emerald-500/10 data-[active=true]:border-emerald-500/30',
  marketing: 'data-[active=true]:text-amber-300 data-[active=true]:bg-amber-500/10 data-[active=true]:border-amber-500/30',
};

function isPocketBaseUrlValid(): boolean {
  const url = import.meta.env.VITE_POCKETBASE_URL;
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Evaluated once at module load; falsy in production builds.
const DEV_WARN_POCKETBASE = import.meta.env.DEV && !isPocketBaseUrlValid();

export default function Dashboard() {
  const { user, tier, logout } = usePocketBase();
  const { hasVenue } = useHasVenue(user?.id);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const beta = isBetaEnabled();
  const isAuthenticated = !!user;

  const hasActiveFilters = activeTab !== 'all' || statusFilter !== 'all' || search !== '';

  const resetFilters = () => {
    setActiveTab('all');
    setStatusFilter('all');
    setSearch('');
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((app) => {
      const matchesSuite = activeTab === 'all' || app.suite === activeTab;
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tags.some((t) => t.toLowerCase().includes(q));
      return matchesSuite && matchesStatus && matchesSearch;
    });
  }, [activeTab, statusFilter, search]);

  const suites: AppSuite[] = ['design', 'operations', 'marketing'];
  const suitesToRender = activeTab === 'all' ? suites : [activeTab as AppSuite];

  const totalTools = apps.length;

  // In beta mode, available = all tools (for authenticated users).
  // In normal mode, available = tools the user's tier unlocks.
  const availableToYou = beta && isAuthenticated
    ? apps.length
    : apps.filter((a) => canAccess(tier, a.requiredTier)).length;

  const liveAndReady = apps.filter((a) => a.status === 'live_or_ready').length;

  // In beta mode, nothing is locked for authenticated users.
  const lockedByPlan = beta && isAuthenticated
    ? 0
    : apps.filter((a) => !canAccessInContext(tier, a.requiredTier, isAuthenticated)).length;

  const noResults = filtered.length === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -left-64 w-[40rem] h-[40rem] rounded-full bg-cyan-500/3 blur-3xl" />
        <div className="absolute top-1/2 -right-64 w-[40rem] h-[40rem] rounded-full bg-amber-500/3 blur-3xl" />
      </div>

      {/* Dev-only config warning */}
      {DEV_WARN_POCKETBASE && (
        <div className="relative z-20 flex items-center gap-2.5 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Dev:</strong> VITE_POCKETBASE_URL is missing or invalid. Copy{' '}
            <code className="font-mono bg-amber-500/10 px-1 rounded">.env.example</code> to{' '}
            <code className="font-mono bg-amber-500/10 px-1 rounded">.env</code> and set a valid URL. This banner is hidden in production.
          </span>
        </div>
      )}

      {/* Beta access banner */}
      {beta && (
        <div className="relative z-20 flex items-center gap-2.5 px-4 py-2.5 bg-teal-500/10 border-b border-teal-500/20 text-teal-300 text-xs">
          <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Beta access enabled</strong> — all 15 tools are temporarily unlocked for testing. Tier badges reflect the production plan each tool will require.
          </span>
        </div>
      )}

      {/* Header */}
      <header className="relative border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">ImmersiveKit</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-slate-400 text-xs truncate max-w-[180px]">{user?.email}</span>
            <TierBadge tier={tier} />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* First-run onboarding: prompt users with no venue to run the wizard */}
        {isAuthenticated && hasVenue === false && <VenueOnboardingBanner />}

        {/* Hero */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-cyan-400 mb-2">
            ImmersiveKit Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Design better rooms.{' '}
            <span className="text-slate-400">Run cleaner operations.</span>{' '}
            <span className="text-slate-500">Fill more seats.</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            15 tools across three suites, structured to take you from room concept to opening day to a full calendar.
          </p>
        </div>

        {/* Stat bar */}
        <div className="flex flex-wrap gap-6 sm:gap-10 mb-10 pb-8 border-b border-slate-800/60">
          {[
            { label: 'Total Tools', value: totalTools, icon: LayoutGrid, color: 'text-white' },
            {
              label: beta && isAuthenticated ? 'Available in Beta' : 'Available to You',
              value: availableToYou,
              icon: CheckCircle,
              color: 'text-emerald-400',
            },
            { label: 'Live & Ready', value: liveAndReady, icon: Zap, color: 'text-cyan-400' },
            {
              label: beta && isAuthenticated ? 'Locked During Beta' : 'Locked by Plan',
              value: lockedByPlan,
              icon: Lock,
              color: beta && isAuthenticated ? 'text-slate-600' : 'text-amber-400',
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`${color} opacity-60`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-bold ${color}`}>{value}</span>
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  data-active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 transition-all ${tabAccent[tab.id]}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:ml-4 sm:pl-4 sm:border-l sm:border-slate-800">
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  data-active={statusFilter === opt.id}
                  onClick={() => setStatusFilter(opt.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent text-slate-400 hover:text-white hover:bg-slate-800 transition-all data-[active=true]:text-white data-[active=true]:bg-slate-700"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search tools, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Suite Sections or Empty State */}
        {noResults ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">No tools match your filters</h3>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
              Try adjusting your suite selection, status filter, or search query.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:border-slate-600 transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-14">
            {suitesToRender.map((suite) => {
              const suiteApps = filtered.filter((a) => a.suite === suite);
              if (suiteApps.length === 0) return null;
              return (
                <SuiteSection
                  key={suite}
                  suite={suite}
                  title={suiteMeta[suite].title}
                  eyebrow={suiteMeta[suite].eyebrow}
                  description={suiteMeta[suite].description}
                  apps={suiteApps}
                  userTier={tier}
                  isAuthenticated={isAuthenticated}
                />
              );
            })}
          </div>
        )}

        <div className="mt-14">
          <SubscriptionGate userTier={tier} />
        </div>
      </main>
    </div>
  );
}
