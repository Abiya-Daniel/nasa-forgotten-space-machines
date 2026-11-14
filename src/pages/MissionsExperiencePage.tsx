import { useState } from 'react';
import {
  Compass,
  Gamepad2,
  Radio,
  Footprints,
  Activity,
  Sparkles,
} from 'lucide-react';
import { EquipmentItem } from '../types/equipment';
import { FirstPersonMissionExperience } from '../components/FirstPersonMissionExperience';
import { MarsRoverSimulator } from '../components/MarsRoverSimulator';
import { WhereIsItNowTracker } from '../components/WhereIsItNowTracker';
import { WalkInFootstepsExplorer } from '../components/WalkInFootstepsExplorer';
import { MissionControlRoom } from '../components/MissionControlRoom';
import { CosmicJourney } from '../components/CosmicJourney';

type MissionsTab =
  | 'first-person'
  | 'rover'
  | 'tracker'
  | 'footsteps'
  | 'control-room'
  | 'cosmic';

interface MissionsExperiencePageProps {
  onOpenMachine: (item: EquipmentItem) => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

const TABS: { id: MissionsTab; label: string; icon: typeof Compass }[] = [
  { id: 'first-person', label: 'First-Person Missions', icon: Compass },
  { id: 'rover', label: 'Drive a Mars Rover (3D)', icon: Gamepad2 },
  { id: 'tracker', label: 'Where Is It Now?', icon: Radio },
  { id: 'footsteps', label: 'Walk in Its Footsteps', icon: Footprints },
  { id: 'control-room', label: 'Mission Control Room', icon: Activity },
  { id: 'cosmic', label: 'Cosmic Scale Journey', icon: Sparkles },
];

export function MissionsExperiencePage({
  onOpenMachine,
  onLocateOnMap,
}: MissionsExperiencePageProps) {
  const [tab, setTab] = useState<MissionsTab>('first-person');

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
          Immersive Space Experiences · Interactive Simulation &amp; Telemetry Wing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Mission Experiences, 3D Rover Drive &amp; Live Tracking
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Step inside first-person historical journeys, pilot a 3D rover across simulated Martian craters, trace real off-world traverses, manage Mission Control crises, and track where humanity&apos;s spacecraft are today.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Immersive mission experience modules"
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
              className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? 'border-amber-400 bg-amber-500 text-slate-950'
                  : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        {tab === 'first-person' && <FirstPersonMissionExperience />}
        {tab === 'rover' && <MarsRoverSimulator />}
        {tab === 'tracker' && (
          <WhereIsItNowTracker
            onOpenMachine={onOpenMachine}
            onLocateOnMap={onLocateOnMap}
          />
        )}
        {tab === 'footsteps' && <WalkInFootstepsExplorer />}
        {tab === 'control-room' && <MissionControlRoom />}
        {tab === 'cosmic' && <CosmicJourney />}
      </div>
    </div>
  );
}
