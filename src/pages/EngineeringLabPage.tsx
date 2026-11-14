import { useState } from 'react';
import {
  Layers,
  Wrench,
  BatteryCharging,
  Radio,
  Rocket,
} from 'lucide-react';
import { ExplodedViewMuseum } from '../components/ExplodedViewMuseum';
import { BuildSpacecraftLab } from '../components/BuildSpacecraftLab';
import { PowerChallengeSim } from '../components/PowerChallengeSim';
import { CommsDelaySimulator } from '../components/CommsDelaySimulator';
import { SurviveLandingSim } from '../components/SurviveLandingSim';

type EngineeringTab = 'exploded' | 'builder' | 'power' | 'comms' | 'landing';

const TABS: { id: EngineeringTab; label: string; icon: typeof Layers }[] = [
  { id: 'exploded', label: 'Exploded View Museum (3D)', icon: Layers },
  { id: 'builder', label: 'Build Your Own Mission', icon: Wrench },
  { id: 'power', label: 'Power Challenge Lab', icon: BatteryCharging },
  { id: 'comms', label: 'Comms Delay Simulator', icon: Radio },
  { id: 'landing', label: 'Survive the Landing', icon: Rocket },
];

export function EngineeringLabPage() {
  const [tab, setTab] = useState<EngineeringTab>('exploded');

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
          Interactive Engineering &amp; Physics Simulation Lab
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Engineering Lab, 3D Exploded Hardware &amp; Survival Simulators
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Separate spacecraft assemblies in 3D, architect custom deep-space missions, ration failing power budgets, witness multi-hour radio light delays, and pilot a descent lander to safe touchdown.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Engineering simulator modules"
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
        {tab === 'exploded' && <ExplodedViewMuseum />}
        {tab === 'builder' && <BuildSpacecraftLab />}
        {tab === 'power' && <PowerChallengeSim />}
        {tab === 'comms' && <CommsDelaySimulator />}
        {tab === 'landing' && <SurviveLandingSim />}
      </div>
    </div>
  );
}
