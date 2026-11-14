import { useState } from 'react';
import { Radio, AlertTriangle, HelpCircle, BookOpen, ExternalLink, Compass } from 'lucide-react';
import { FINAL_SIGNAL_RECORDS } from '../data/museumExperiencesData';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem } from '../types/equipment';
import { ZoomableNasaImage } from './ZoomableNasaImage';

interface FinalSignalExperienceProps {
  onOpenMachine?: (item: EquipmentItem) => void;
}

export function FinalSignalExperience({ onOpenMachine }: FinalSignalExperienceProps) {
  const [selectedId, setSelectedId] = useState<string>(FINAL_SIGNAL_RECORDS[0].id);

  const active =
    FINAL_SIGNAL_RECORDS.find((entry) => entry.id === selectedId) ||
    FINAL_SIGNAL_RECORDS[0];

  const linkedEquipment = EQUIPMENT_DATA.find((e) => e.id === active.equipmentId);

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Radio className="w-4 h-4" />
            <span>End-of-Contact Telemetry Archive · Documented Facts Only</span>
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-100">
            The Final Signal Experience
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Explore the last verified telemetry moments of historic spacecraft whose
            batteries drained, dust blanketed solar arrays, or mission controllers
            commanded an intentional protective deorbit. All uncertainty is clearly
            separated from confirmed engineering facts.
          </p>
        </div>
      </div>

      {/* Mission Selector Tabs */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Select spacecraft final signal record"
      >
        {FINAL_SIGNAL_RECORDS.map((entry) => {
          const isSelected = entry.id === active.id;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedId(entry.id)}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              {entry.machineName}
            </button>
          );
        })}
      </div>

      {/* Active Final Signal Case Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-lg border border-slate-800 bg-[#0B0F18] p-5 sm:p-6">
        {/* Left: Authentic Photo + Signal Attenuation Graph */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-md overflow-hidden border border-slate-800 bg-[#07090E]">
            <ZoomableNasaImage
              src={active.photo.imageUrl}
              fallbackSrc={active.photo.fallbackUrl}
              alt={active.photo.title}
              caption={active.photo.title}
              credit={active.photo.credit}
              sourceUrl={active.photo.sourceUrl}
              nasaId={active.photo.nasaId}
              aspectClassName="aspect-[4/3] w-full"
            />
            <div className="p-3 text-xs text-slate-400 border-t border-slate-800/80 space-y-1">
              <div className="font-mono text-[11px] text-sky-400">
                Authentic NASA Photograph · ID: {active.photo.nasaId}
              </div>
              <p className="text-slate-200 font-medium">{active.photo.title}</p>
            </div>
          </div>

          {/* Signal Attenuation Chart */}
          <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-slate-400">
                Documented Signal Continuity Profile
              </span>
              <span className="font-mono text-amber-400 tabular-nums">
                Last Signal: 0%
              </span>
            </div>

            <div className="space-y-2.5" aria-label="Relative telemetry availability chart">
              {active.signalStrengthTimeline.map((point) => (
                <div key={point.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300">{point.label}</span>
                    <span className="text-sky-300 tabular-nums">{point.level}%</span>
                  </div>
                  <div className="h-2 w-full rounded bg-slate-800/90 overflow-hidden">
                    <div
                      className={`h-full transition-[width] duration-300 ${
                        point.level === 0
                          ? 'bg-slate-600'
                          : point.level < 30
                            ? 'bg-amber-400'
                            : 'bg-sky-400'
                      }`}
                      style={{ width: `${point.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
              Relative profile illustrating operational telemetry power/link margin leading into final loss of signal.
            </p>
          </div>
        </div>

        {/* Right: Structured Engineering Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          <div className="border-b border-slate-800 pb-4 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono">
              <span className="text-sky-400">{active.mission}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-300">{active.statusLabel}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              {active.machineName}
            </h3>
            <p className="text-xs font-mono text-slate-300 tabular-nums">
              Last Verified Signal: <strong className="text-white">{active.lastSignalDate}</strong>
            </p>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              Final Verified Telemetry Event
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {active.finalEventSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Confirmed Termination Cause</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {active.confirmedCause}
              </p>
            </div>

            <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                <Compass className="w-3.5 h-3.5" />
                <span>Engineering Context &amp; Recovery</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {active.scientificInterpretation}
              </p>
            </div>
          </div>

          <div className="rounded-md border border-slate-800/90 bg-[#080D17] p-4 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>What Remains Uncertain / Unobserved</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {active.unknownOrUncertain}
            </p>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Present-Day State &amp; Aftermath
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {active.aftermath}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            {linkedEquipment && onOpenMachine && (
              <button
                type="button"
                onClick={() => onOpenMachine(linkedEquipment)}
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full Mission Dossier</span>
              </button>
            )}

            <a
              href={active.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 hover:underline ml-auto"
            >
              <span>Official NASA Mission Archive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
