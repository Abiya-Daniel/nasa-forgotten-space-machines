import { useState } from 'react';
import { Radio, ExternalLink, Compass, CheckCircle2, Clock } from 'lucide-react';
import { WHERE_IS_IT_NOW_RECORDS } from '../data/phase2InteractiveData';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem } from '../types/equipment';
import { useExperience } from '../context/ExperienceContext';

interface WhereIsItNowTrackerProps {
  onOpenMachine?: (item: EquipmentItem) => void;
  onLocateOnMap?: (item: EquipmentItem) => void;
}

export function WhereIsItNowTracker({
  onOpenMachine,
  onLocateOnMap,
}: WhereIsItNowTrackerProps) {
  const [selectedId, setSelectedId] = useState(WHERE_IS_IT_NOW_RECORDS[0].id);
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'stationary'>('all');
  const { unlockBadge } = useExperience();

  const visibleList = WHERE_IS_IT_NOW_RECORDS.filter((r) => {
    if (filterMode === 'active') return r.isStillOperational;
    if (filterMode === 'stationary') return !r.isStillOperational;
    return true;
  });

  const active =
    WHERE_IS_IT_NOW_RECORDS.find((r) => r.id === selectedId) || visibleList[0] || WHERE_IS_IT_NOW_RECORDS[0];

  const matchingEquipment = EQUIPMENT_DATA.find((e) => e.id === active.equipmentId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    if (id === 'win-insight' || id === 'win-opportunity') {
      unlockBadge('badge-mars-pioneer');
    }
    if (id === 'win-voyager1' || id === 'win-voyager2' || id === 'win-newhorizons') {
      unlockBadge('badge-deep-space');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <Radio className="w-4 h-4" />
            <span>Where Is It Now? · Verified Ephemeris &amp; Archival Status Tracker</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Tracking Active Deep-Space Travelers &amp; Quiet Planetary Monuments
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Shows each spacecraft&apos;s destination, last confirmed location, one-way light delay, and honest operational status with explicit archival timestamps—never simulated as live streaming telemetry.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 shrink-0">
          {(
            [
              { id: 'all', label: 'All Tracked' },
              { id: 'active', label: 'Still Active / Travelling' },
              { id: 'stationary', label: 'Retired / Silent Relics' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterMode(f.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                filterMode === f.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-2">
          {visibleList.map((rec) => {
            const isSel = rec.id === active.id;
            return (
              <button
                key={rec.id}
                type="button"
                onClick={() => handleSelect(rec.id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                  isSel
                    ? 'border-amber-400 bg-[#121A2C] text-white'
                    : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className={rec.isStillOperational ? 'text-emerald-400' : 'text-amber-300'}>
                    {rec.statusLabel}
                  </span>
                  <span className="text-slate-400 tabular-nums">{rec.lightTimeOneWay}</span>
                </div>
                <div className="mt-1 text-sm font-bold">{rec.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{rec.destination}</div>
              </button>
            );
          })}
        </div>

        <article className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="font-mono text-xs text-sky-400">{active.mission}</div>
              <h3 className="mt-1 text-2xl font-bold text-white">{active.name}</h3>
            </div>
            <span
              className={`rounded-md border px-3 py-1 font-mono text-xs font-semibold ${
                active.isStillOperational
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
                  : 'border-amber-500/40 bg-[#16130D] text-amber-300'
              }`}
            >
              {active.statusLabel}
            </span>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400">Current / Final Destination</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-100">{active.destination}</dd>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400">Distance From Earth</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-amber-300 tabular-nums">
                {active.distanceFromEarth}
              </dd>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>One-Way Light / Radio Delay</span>
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-sky-300 tabular-nums">
                {active.lightTimeOneWay}
              </dd>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400">Trajectory / Region</dt>
              <dd className="mt-1 text-xs text-slate-200 leading-relaxed">
                {active.trajectoryOrRegion}
              </dd>
            </div>
          </dl>

          <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1.5">
            <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
              Last Confirmed Position &amp; Status ({active.checkedDate})
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{active.lastConfirmedPosition}</p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Key Flight Milestones
            </div>
            <div className="flex flex-wrap gap-2">
              {active.milestones.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 rounded border border-slate-800 bg-[#07090E] px-2.5 py-1 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{m}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-4">
            {matchingEquipment && onLocateOnMap && matchingEquipment.body !== 'orbital' && (
              <button
                type="button"
                onClick={() => onLocateOnMap(matchingEquipment)}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Locate on 3D Atlas / Trajectory</span>
              </button>
            )}
            {matchingEquipment && onOpenMachine && (
              <button
                type="button"
                onClick={() => onOpenMachine(matchingEquipment)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-4 py-2 text-xs font-semibold text-slate-200 hover:border-sky-400 cursor-pointer"
              >
                <span>Open Full Machine Dossier</span>
              </button>
            )}
            <a
              href={active.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
            >
              <span>NASA Mission Reference</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
