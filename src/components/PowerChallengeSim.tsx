import { useState, useMemo } from 'react';
import { BatteryCharging, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

interface PowerScenario {
  id: string;
  title: string;
  missionRef: string;
  supplyW: number;
  targetHours: number;
  requiredMinSystems: string[];
  warningNote: string;
}

const SCENARIOS: PowerScenario[] = [
  {
    id: 'pwr-storm',
    title: 'Martian Global Dust Storm (InSight / Opportunity Mode)',
    missionRef: 'Solar array output dropped 88% beneath opaque red dust skies',
    supplyW: 62,
    targetHours: 24,
    requiredMinSystems: ['heaters', 'computer'],
    warningNote: 'If Core Survival Heaters turn off overnight (-95 °C), onboard electronics shatter from thermal contraction.',
  },
  {
    id: 'pwr-lunar-night',
    title: 'Lunar 14-Day Freeze Transition',
    missionRef: 'Surveyor / LRV twilight battery rationing',
    supplyW: 48,
    targetHours: 14,
    requiredMinSystems: ['heaters', 'computer'],
    warningNote: 'Driving motors and high-rate cameras drain emergency batteries rapidly during shadow crossing.',
  },
  {
    id: 'pwr-voyager',
    title: 'Voyager 1 Year-49 RTG Decay Management',
    missionRef: 'Plutonium-238 output fell from 470 W (1977) to ~225 W (2026)',
    supplyW: 225,
    targetHours: 100,
    requiredMinSystems: ['computer', 'radio', 'plasma'],
    warningNote: 'Cameras and several heaters are permanently turned off to keep science instruments and the 22W transmitter alive.',
  },
];

const SUBSYSTEMS = [
  { id: 'computer', label: 'Flight Computer & Clock (Essential)', watts: 24 },
  { id: 'heaters', label: 'Core Electronics Survival Heaters', watts: 30 },
  { id: 'radio', label: 'High-Gain Telemetry Transmitter', watts: 65 },
  { id: 'plasma', label: 'Low-Power Cosmic/Plasma Sensor', watts: 18 },
  { id: 'camera', label: 'Panoramic Stereo Imaging Mast', watts: 35 },
  { id: 'wheels', label: '6-Wheel Drive Motors & Drill', watts: 75 },
];

export function PowerChallengeSim() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [enabledIds, setEnabledIds] = useState<string[]>(['computer', 'heaters', 'camera']);
  const { unlockBadge, recordSimCompletion } = useExperience();

  const sc = SCENARIOS[scenarioIdx];

  const toggleSub = (id: string) => {
    setEnabledIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const status = useMemo(() => {
    const drawW = SUBSYSTEMS.filter((s) => enabledIds.includes(s.id)).reduce(
      (sum, s) => sum + s.watts,
      0
    );
    const margin = sc.supplyW - drawW;
    const missingCritical = sc.requiredMinSystems.filter((req) => !enabledIds.includes(req));
    const survives = margin >= 0 && missingCritical.length === 0;
    return { drawW, margin, missingCritical, survives };
  }, [enabledIds, sc]);

  const handleVerify = () => {
    if (status.survives) {
      unlockBadge('badge-space-scientist');
      recordSimCompletion(`power-${sc.id}`);
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
          <BatteryCharging className="w-4 h-4" />
          <span>Power Challenge Simulator · Survival Power Rationing</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Shed Non-Essential Loads to Keep Your Spacecraft Alive
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Toggle spacecraft subsystems on and off so total power demand stays within available sunlight or decaying RTG output while keeping critical survival hardware protected.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setScenarioIdx(idx);
              setEnabledIds(idx === 2 ? ['computer', 'radio', 'plasma', 'camera', 'wheels'] : ['computer', 'heaters', 'camera']);
            }}
            className={`rounded-md px-3.5 py-2 text-xs font-semibold cursor-pointer ${
              idx === scenarioIdx
                ? 'bg-amber-500 text-slate-950'
                : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="font-mono text-xs text-sky-400">Subsystem Breaker Panel</div>
              <p className="text-xs text-slate-400 mt-0.5">{sc.missionRef}</p>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400 tabular-nums">
              Supply: {sc.supplyW} W
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBSYSTEMS.map((sub) => {
              const on = enabledIds.includes(sub.id);
              const isCritical = sc.requiredMinSystems.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => toggleSub(sub.id)}
                  className={`rounded-lg border p-3.5 text-left cursor-pointer transition-colors ${
                    on
                      ? 'border-sky-400 bg-[#101C30] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={on ? 'text-emerald-400' : 'text-slate-500'}>
                      {on ? 'POWERED ON' : 'SHED / OFF'}
                    </span>
                    <span className="text-amber-300 tabular-nums">{sub.watts} W</span>
                  </div>
                  <div className="mt-1 text-sm font-bold">{sub.label}</div>
                  {isCritical && (
                    <div className="mt-1 text-[10px] font-mono text-amber-400">
                      Required for this crisis
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-4">
          <div className="font-mono text-xs text-amber-400">Live Bus Telemetry (Simulated)</div>

          <dl className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Available</dt>
              <dd className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
                {sc.supplyW} W
              </dd>
            </div>
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Load Draw</dt>
              <dd
                className={`mt-1 font-mono text-lg font-bold tabular-nums ${
                  status.margin < 0 ? 'text-rose-400' : 'text-sky-300'
                }`}
              >
                {status.drawW} W
              </dd>
            </div>
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Margin</dt>
              <dd
                className={`mt-1 font-mono text-lg font-bold tabular-nums ${
                  status.margin < 0 ? 'text-rose-400' : 'text-amber-300'
                }`}
              >
                {status.margin >= 0 ? `+${status.margin}` : status.margin} W
              </dd>
            </div>
          </dl>

          <p className="text-xs text-slate-300 leading-relaxed">{sc.warningNote}</p>

          <div
            className={`rounded-md border p-4 text-xs space-y-2 ${
              status.survives
                ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-100'
                : 'border-rose-500/50 bg-rose-950/20 text-rose-100'
            }`}
          >
            <div className="inline-flex items-center gap-2 font-bold">
              {status.survives ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              )}
              <span>
                {status.survives
                  ? 'Power Budget Balanced — Spacecraft Survives!'
                  : status.margin < 0
                    ? `Brownout Warning: Reduce load by ${Math.abs(status.margin)} W!`
                    : `Critical System Offline: Enable ${status.missingCritical.join(', ')}`}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={!status.survives}
            className="w-full rounded-md bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-40 cursor-pointer"
          >
            {status.survives
              ? 'Lock Safe-Mode Configuration & Claim Scientist Progress'
              : 'Balance Load & Critical Systems First'}
          </button>
        </div>
      </div>
    </section>
  );
}
