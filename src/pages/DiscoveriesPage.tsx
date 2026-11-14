import { useState, useEffect } from 'react';
import { Microscope, Radio, Sparkles, Eye, Ruler, Bookmark } from 'lucide-react';
import { EquipmentItem, FeaturedMachineId } from '../types/equipment';
import { DiscoveryInvestigationLab } from '../components/DiscoveryInvestigationLab';
import { FinalSignalExperience } from '../components/FinalSignalExperience';
import { IfMachineCouldSpeak } from '../components/IfMachineCouldSpeak';
import { PanoramaViewer } from '../components/PanoramaViewer';
import { SpaceScaleComparison } from '../components/SpaceScaleComparison';
import { useExperience } from '../context/ExperienceContext';
import { DISCOVERY_INVESTIGATIONS } from '../data/museumExperiencesData';

export type DiscoveriesTabId =
  | 'investigate'
  | 'final-signal'
  | 'speak'
  | 'panorama'
  | 'scale';

interface DiscoveriesPageProps {
  initialTab?: DiscoveriesTabId;
  onOpenMachine: (item: EquipmentItem) => void;
  onOpenFeaturedDossier: (id: FeaturedMachineId) => void;
}

const TABS: { id: DiscoveriesTabId; label: string; icon: typeof Microscope }[] = [
  { id: 'investigate', label: 'Discovery Investigation', icon: Microscope },
  { id: 'final-signal', label: 'Final Signal Experience', icon: Radio },
  { id: 'speak', label: 'If This Machine Could Speak', icon: Sparkles },
  { id: 'panorama', label: 'Surface Panorama Viewer', icon: Eye },
  { id: 'scale', label: 'Space Scale Comparison', icon: Ruler },
];

export function DiscoveriesPage({
  initialTab = 'investigate',
  onOpenMachine,
  onOpenFeaturedDossier,
}: DiscoveriesPageProps) {
  const [tab, setTab] = useState<DiscoveriesTabId>(initialTab);
  const { savedDiscoveries } = useExperience();

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const savedCases = DISCOVERY_INVESTIGATIONS.filter((c) =>
    savedDiscoveries.includes(c.id)
  );

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Interactive Science Exhibits &amp; Storytelling Halls
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
            Discoveries, Final Signals &amp; Immersive Archives
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Investigate landmark planetary discoveries, explore the documented final
            signals of silent spacecraft, listen to fact-grounded machine reflections,
            pan across authentic lunar and Martian surface mosaics, and compare
            engineering scales.
          </p>
        </div>

        <div className="rounded-md border border-slate-800 bg-[#0B0F18] px-4 py-3 text-xs shrink-0">
          <div className="inline-flex items-center gap-1.5 font-semibold text-amber-300">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Discoveries: {savedCases.length}</span>
          </div>
          <p className="text-slate-400 mt-0.5">
            {savedCases.length > 0
              ? savedCases.map((c) => c.machine.split(' (')[0]).join(' · ')
              : 'Bookmark breakthroughs inside Discovery Investigation'}
          </p>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        className="flex flex-wrap gap-2 border-b border-slate-800 pb-4"
        role="tablist"
        aria-label="Discovery & interactive archive tabs"
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
              className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === 'investigate' && <DiscoveryInvestigationLab />}
      {tab === 'final-signal' && (
        <FinalSignalExperience onOpenMachine={onOpenMachine} />
      )}
      {tab === 'speak' && (
        <IfMachineCouldSpeak onOpenFeaturedDossier={onOpenFeaturedDossier} />
      )}
      {tab === 'panorama' && <PanoramaViewer />}
      {tab === 'scale' && <SpaceScaleComparison />}
    </div>
  );
}
