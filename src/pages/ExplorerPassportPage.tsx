import { useState } from 'react';
import { Shield, Map, CreditCard } from 'lucide-react';
import { EquipmentItem } from '../types/equipment';
import { ExplorerPassportHub } from '../components/ExplorerPassportHub';
import { MuseumToursPanel } from '../components/MuseumToursPanel';
import { MissionCardCreator } from '../components/MissionCardCreator';

type PassportTab = 'passport' | 'tours' | 'card-creator';

interface ExplorerPassportPageProps {
  onOpenMachine: (item: EquipmentItem) => void;
}

export function ExplorerPassportPage({
  onOpenMachine,
}: ExplorerPassportPageProps) {
  const [tab, setTab] = useState<PassportTab>('passport');

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
          Visitor Credentials, Guided Tours &amp; Community Reflections
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Explorer Passport, Museum Tours &amp; Mission Card Studio
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Track your museum discoveries and 12 achievement badges, take 5 curated exhibition tours, solve the Challenge of the Week, share local discovery notes, and export a custom PNG collector card.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Explorer passport sections"
        className="flex flex-wrap gap-2 border-b border-slate-800 pb-4"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'passport'}
          onClick={() => setTab('passport')}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'passport'
              ? 'border-amber-400 bg-amber-500 text-slate-950'
              : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Passport, 12 Badges &amp; Weekly Challenge</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'tours'}
          onClick={() => setTab('tours')}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'tours'
              ? 'border-amber-400 bg-amber-500 text-slate-950'
              : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:text-white'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Guided Museum Tours (5)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'card-creator'}
          onClick={() => setTab('card-creator')}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'card-creator'
              ? 'border-amber-400 bg-amber-500 text-slate-950'
              : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Create Mission Card (PNG)</span>
        </button>
      </div>

      <div>
        {tab === 'passport' && <ExplorerPassportHub />}
        {tab === 'tours' && <MuseumToursPanel onOpenMachine={onOpenMachine} />}
        {tab === 'card-creator' && <MissionCardCreator />}
      </div>
    </div>
  );
}
