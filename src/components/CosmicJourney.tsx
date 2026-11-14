import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { COSMIC_JOURNEY_STOPS } from '../data/phase2InteractiveData';

export function CosmicJourney() {
  const [stopIdx, setStopIdx] = useState(0);
  const stop = COSMIC_JOURNEY_STOPS[stopIdx];

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Sparkles className="w-4 h-4" />
          <span>Cosmic Journey · Logarithmic Scale Scrubber (Earth to Interstellar Space)</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Zoom Outward From Low Earth Orbit Past the Heliopause
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Slide or click across seven cosmic distance bands to witness how dramatically light delay, solar intensity, and spacecraft engineering shift as humanity ventures farther from home.
        </p>
      </div>

      {/* Scrubber Slider */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">Earth / Low Orbit (540 km)</span>
            <span className="text-sky-400">Interstellar Medium (&gt; 25 Billion km)</span>
          </div>
          <input
            type="range"
            min={0}
            max={COSMIC_JOURNEY_STOPS.length - 1}
            value={stopIdx}
            onChange={(e) => setStopIdx(Number(e.target.value))}
            aria-label="Cosmic journey distance stop"
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {COSMIC_JOURNEY_STOPS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStopIdx(idx)}
                className={`rounded-md border px-2.5 py-2 text-left text-[11px] font-medium cursor-pointer transition-colors ${
                  idx === stopIdx
                    ? 'border-amber-400 bg-[#141E33] text-white'
                    : 'border-slate-800 bg-[#07090E] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="font-mono text-[10px] text-sky-400">{s.scaleKm}</div>
                <div className="font-bold mt-0.5 truncate">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Band + Telemetry Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-lg border border-slate-800 bg-[#06080E] p-5">
          <div className="lg:col-span-5 space-y-3">
            <div className="font-mono text-xs text-amber-400">
              Zone 0{stopIdx + 1} of 0{COSMIC_JOURNEY_STOPS.length}
            </div>
            <h3 className="text-2xl font-bold text-white">{stop.label}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{stop.environmentFact}</p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-md border border-slate-800 bg-[#0B0F18] p-4">
              <div className="text-slate-400">Distance Scale</div>
              <div className="mt-1 font-mono text-base font-bold text-amber-300 tabular-nums">
                {stop.distanceLabel}
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#0B0F18] p-4">
              <div className="text-slate-400">One-Way Light Time</div>
              <div className="mt-1 font-mono text-base font-bold text-sky-300 tabular-nums">
                {stop.lightTimeLabel}
              </div>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#0B0F18] p-4">
              <div className="text-slate-400">Ambassador Spacecraft</div>
              <div className="mt-1 text-sm font-bold text-emerald-300">{stop.machineName}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              setStopIdx((i) => (i + 1) % COSMIC_JOURNEY_STOPS.length)
            }
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            <span>Advance to Next Frontier Zone</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
