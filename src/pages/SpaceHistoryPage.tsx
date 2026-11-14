import { useState } from 'react';
import {
  Landmark,
  AlertTriangle,
  SearchCheck,
  Skull,
  Camera,
  HelpCircle,
  Disc3,
  Layers,
} from 'lucide-react';
import { EquipmentItem, PageId } from '../types/equipment';
import {
  HistoryArchivesHub,
  HistoryArchiveSection,
} from '../components/HistoryArchivesHub';
import { MessagesBeyondEarth } from '../components/MessagesBeyondEarth';
import { BlueprintAndTimeMachine } from '../components/BlueprintAndTimeMachine';

type HistoryPageTab = HistoryArchiveSection | 'messages' | 'blueprints';

interface SpaceHistoryPageProps {
  onOpenMachine: (item: EquipmentItem) => void;
  onNavigate: (page: PageId) => void;
}

const TABS: { id: HistoryPageTab; label: string; icon: typeof Landmark }[] = [
  { id: 'museum-halls', label: 'Digital Museum Halls', icon: Landmark },
  { id: 'almost-failed', label: 'Almost Failed', icon: AlertTriangle },
  { id: 'lost-autopsy', label: 'Lost Archive & Autopsy', icon: SearchCheck },
  { id: 'graveyard', label: 'Spacecraft Graveyard', icon: Skull },
  { id: 'last-photo', label: 'The Last Photograph', icon: Camera },
  { id: 'mysteries', label: 'Unanswered Mysteries', icon: HelpCircle },
  { id: 'messages', label: 'Messages Beyond Earth', icon: Disc3 },
  { id: 'blueprints', label: 'Blueprints, Eras & Patches', icon: Layers },
];

export function SpaceHistoryPage({
  onOpenMachine,
  onNavigate,
}: SpaceHistoryPageProps) {
  const [tab, setTab] = useState<HistoryPageTab>('museum-halls');

  const isArchiveSection = (t: HistoryPageTab): t is HistoryArchiveSection =>
    t !== 'messages' && t !== 'blueprints';

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-sky-400">
          Hidden Space History &amp; Museum Curations
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Museum Halls, Mission Autopsy &amp; Interstellar Records
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Tour six curated exhibition halls, investigate missions saved by improvised engineering, reconstruct spacecraft root-cause failures, compare archival blueprints against final landing photos, and decode Voyager&apos;s Golden Record.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Space history exhibition wings"
        className="flex flex-wrap gap-2 border-b border-slate-800 pb-4"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? 'border-amber-400 bg-amber-500 text-slate-950'
                  : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {isArchiveSection(tab) && (
          <HistoryArchivesHub
            activeSection={tab}
            onSelectSection={(sec) => setTab(sec)}
            onOpenMachine={onOpenMachine}
            onNavigate={onNavigate}
          />
        )}
        {tab === 'messages' && <MessagesBeyondEarth />}
        {tab === 'blueprints' && (
          <BlueprintAndTimeMachine onOpenMachine={onOpenMachine} />
        )}
      </div>
    </div>
  );
}
