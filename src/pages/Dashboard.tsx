import { useState, useMemo } from 'react';
import { usePocketBase } from '../hooks/usePocketBase';
import { apps, suiteMeta } from '../data/apps';
import SuiteSection from '../components/SuiteSection';
import SubscriptionGate from '../components/SubscriptionGate';
import TierBadge from '../components/TierBadge';
import type { AppSuite } from '../types';
import { Search, LogOut, LayoutGrid, Zap } from 'lucide-react';

type FilterTab = 'all' | AppSuite;

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Tools' },
  { id: 'design', label: 'Design Suite' },
  { id: 'operations', label: 'Operations Suite' },
  { id: 'marketing', label: 'Marketing Suite' },
];

export default function Dashboard() {
  const { user, tier, logout } = usePocketBase();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((app) => {
      const matchesSuite = activeTab === 'all' || app.suite === activeTab;
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.tags.some((t) => t.toLowerCase().includes(q));
      return matchesSuite && matchesSearch;
    });
  }, [activeTab, search]);

  const suites: AppSuite[] = ['design', 'operations', 'marketing'];
  const suitesToRender = activeTab === 'all' ? suites : [activeTab as AppSuite];

  const tabAccent: Record<FilterTab, string> = {
    all: 'data-[active=true]:text-white data-[active=true]:bg-slate-700',
    design: 'data-[active=true]:text-cyan-300 data-[active=true]:bg-cyan-500/10 data-[active=true]:border-cyan-500/30',
    operations: 'data-[active=true]:text-emerald-300 data-[active=true]:bg-emerald-500/10 data-[active=true]:border-emerald-500/30',
    marketing: 'data-[active=true]:text-amber-300 data-[active=true]:bg-amber-500/10 data-[active=true]:border-amber-500/30',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-64 -left-64 w-[40rem] h-[40rem] rounded-full bg-cyan-500/3 blur-3xl" />
        <div className="absolute top-1/2 -right-64 w-[40rem] h-[40rem] rounded-full bg-amber-500/3 blur-3xl" />
      </div>

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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

        {/* Stat bar */}
        <div className="flex flex-wrap gap-4 mb-10 pb-8 border-b border-slate-800/60">
          {[
            { label: 'Total Tools', value: apps.length, icon: LayoutGrid },
            { label: 'Available to You', value: apps.filter((a) => {
              const canAcc = tier === 'enterprise' ? true : tier === 'pro' ? a.requiredTier !== 'enterprise' : a.requiredTier === 'free';
              return canAcc;
            }).length },
            { label: 'Live & Ready', value: apps.filter((a) => a.status === 'live_or_ready').length },
            { label: 'In Development', value: apps.filter((a) => a.status === 'planned').length },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Suite Sections */}
        <div className="space-y-14">
          {suitesToRender.map((suite) => {
            const suiteApps = filtered.filter((a) => a.suite === suite);
            if (suiteApps.length === 0 && search) return null;
            return (
              <SuiteSection
                key={suite}
                suite={suite}
                title={suiteMeta[suite].title}
                eyebrow={suiteMeta[suite].eyebrow}
                description={suiteMeta[suite].description}
                apps={suiteApps}
                userTier={tier}
              />
            );
          })}
        </div>

        <SubscriptionGate userTier={tier} />
      </main>
    </div>
  );
}
