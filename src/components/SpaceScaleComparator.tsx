import { useState, useEffect } from 'react';
import { Ruler, Radio, Clock, Gauge, Orbit, Play } from 'lucide-react';

type ScaleMode = 'size' | 'distance' | 'signal' | 'lifetime' | 'speed';

const SPACECRAFT_SIZE_DATA = [
  { name: 'Sojourner Rover (1997)', meters: 0.65, note: 'Size of a microwave oven (0.65 m long)' },
  { name: 'Opportunity Rover (2004)', meters: 1.6, note: 'Golf-cart footprint (1.6 m × 2.3 m solar span)' },
  { name: 'Apollo 15 LRV-1 (1971)', meters: 3.1, note: '3.1 m length; carried two suited astronauts' },
  { name: 'Voyager 1 Dish + Boom (1977)', meters: 13.0, note: '3.7 m dish + 13 m magnetometer boom' },
  { name: 'Hubble Space Telescope (1990)', meters: 13.2, note: 'School-bus size (13.2 m long, 11.1 tonnes)' },
];

const DISTANCE_DATA = [
  { name: 'Hubble Space Telescope', km: 515, auLabel: '0.000003 AU', region: 'Low Earth Orbit' },
  { name: 'Moon (Apollo 15 LRV-1)', km: 384400, auLabel: '0.0026 AU', region: 'Lunar Surface' },
  { name: 'Mars Avg (InSight / Opportunity)', km: 225000000, auLabel: '1.50 AU avg', region: 'Martian Plains' },
  { name: 'Jupiter (Galileo)', km: 778000000, auLabel: '5.2 AU', region: 'Jovian System' },
  { name: 'Saturn (Cassini-Huygens)', km: 1430000000, auLabel: '9.5 AU', region: 'Saturnian System' },
  { name: 'Pluto Encounter (New Horizons)', km: 5000000000, auLabel: '33+ AU', region: 'Kuiper Belt' },
  { name: 'Voyager 1 (Interstellar)', km: 25100000000, auLabel: '~168+ AU', region: 'Interstellar Space' },
];

const SIGNAL_DELAY_DATA = [
  { name: 'Apollo 15 (Moon)', oneWaySec: 1.28, label: '1.28 seconds', note: 'Live voice delay noticeable on Apollo broadcasts' },
  { name: 'Opportunity / Curiosity (Mars)', oneWaySec: 750, label: '~12.5 minutes avg (3–22 min)', note: 'Too slow for real-time joysticks; rovers must think autonomously' },
  { name: 'Cassini (Saturn)', oneWaySec: 4980, label: '~83 minutes', note: 'Final Grand Finale plunge signals reached Earth 83 min after breakup' },
  { name: 'New Horizons (Kuiper Belt)', oneWaySec: 30000, label: '~8.3 hours', note: '16+ hours round-trip to confirm a single radio command' },
  { name: 'Voyager 1 (Interstellar)', oneWaySec: 83800, label: '~23.3 hours', note: 'Nearly 2 full days round-trip at the speed of light' },
];

const LIFETIME_DATA = [
  { name: 'Sojourner Rover', designDays: 7, actualDays: 83, ratio: '11.8× design life' },
  { name: 'Lunokhod 1 Rover', designDays: 90, actualDays: 322, ratio: '3.6× design life' },
  { name: 'Spirit Rover', designDays: 90, actualDays: 2269, ratio: '25.2× design life' },
  { name: 'Opportunity Rover', designDays: 90, actualDays: 5352, ratio: '59.5× design life' },
  { name: 'Voyager 1 (Active)', designDays: 1825, actualDays: 17900, ratio: '9.8× primary goal (49+ yrs)' },
];

const SPEED_DATA = [
  { name: 'Perseverance (Mars)', speedKmH: 0.15, note: '~0.15 km/h max — prioritizes autonomy and rock safety' },
  { name: 'Opportunity (Mars)', speedKmH: 0.18, note: '~0.18 km/h top flat-ground speed (~5 cm/s)' },
  { name: 'Lunokhod 2 (Moon)', speedKmH: 2.0, note: '~2.0 km/h high gear controlled in near real-time from Earth' },
  { name: 'Apollo 17 LRV-3 (Moon)', speedKmH: 18.0, note: '18.0 km/h downhill lunar speed record (Eugene Cernan)' },
];

export function SpaceScaleComparator() {
  const [mode, setMode] = useState<ScaleMode>('signal');
  const [pulseTargetIdx, setPulseTargetIdx] = useState(0);
  const [pulseProgress, setPulseProgress] = useState(0);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!simulating) return;
    const durationMs = Math.min(4500, Math.max(900, SIGNAL_DELAY_DATA[pulseTargetIdx].oneWaySec * 2));
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setPulseProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
      else setSimulating(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [simulating, pulseTargetIdx]);

  const startPulse = (idx: number) => {
    setPulseTargetIdx(idx);
    setPulseProgress(0);
    setSimulating(true);
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-[#080E1B] p-5 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#E8A95B]">
            Interactive Scale &amp; Physics Comparator
          </span>
          <h3 className="mt-1 text-xl font-bold text-[#F4F7FB]">
            Spacecraft Sizes, Distances &amp; Speed of Light Delays
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'signal', label: 'Light-Speed Delay', icon: Radio },
              { id: 'size', label: 'Machine Size', icon: Ruler },
              { id: 'distance', label: 'Distance (Log)', icon: Orbit },
              { id: 'lifetime', label: 'Design vs Actual', icon: Clock },
              { id: 'speed', label: 'Rover Speeds', icon: Gauge },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'border-[#4C9AFF] bg-[#10213A] text-white'
                    : 'border-slate-800 bg-[#05070D] text-slate-300 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mode === 'signal' && (
        <div className="space-y-4">
          <p className="text-sm text-[#9BA8BA]">
            Even radio waves travelling at the speed of light (299,792 km/s) take seconds to reach the Moon and nearly a full day to reach Voyager 1. Click <strong className="text-white">Send Pulse</strong> to simulate relative signal latency.
          </p>
          <div className="space-y-3">
            {SIGNAL_DELAY_DATA.map((item, idx) => {
              const isActive = idx === pulseTargetIdx;
              const pct = Math.max(4, (Math.log10(item.oneWaySec + 1) / Math.log10(90000)) * 100);
              return (
                <div key={item.name} className="rounded-md border border-slate-800 bg-[#05070D] p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-[#F4F7FB]">{item.name}</span>
                      <span className="ml-2 text-xs font-mono text-[#E8A95B]">{item.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => startPulse(idx)}
                      className="inline-flex items-center gap-1 rounded border border-slate-700 bg-[#080E1B] px-2.5 py-1 text-xs font-medium text-[#4C9AFF] hover:border-[#4C9AFF] cursor-pointer"
                    >
                      <Play className="w-3 h-3" />
                      <span>Send Pulse</span>
                    </button>
                  </div>
                  <div className="relative h-2.5 w-full rounded bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded bg-[#10213A] border-r-2 border-[#4C9AFF]"
                      style={{ width: `${pct}%` }}
                    />
                    {isActive && (
                      <div
                        className="absolute top-0 bottom-0 w-3 rounded-full bg-[#E8A95B]"
                        style={{ left: `calc(${Math.min(97, pulseProgress * pct)}% )` }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-[#9BA8BA]">{item.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'size' && (
        <div className="space-y-3">
          {SPACECRAFT_SIZE_DATA.map((item) => (
            <div key={item.name} className="rounded-md border border-slate-800 bg-[#05070D] p-3.5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-[#F4F7FB]">{item.name}</span>
                <span className="font-mono text-[#4C9AFF]">{item.meters} m</span>
              </div>
              <div className="h-3 w-full rounded bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded bg-[#4C9AFF]"
                  style={{ width: `${(item.meters / 13.5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#9BA8BA]">{item.note}</p>
            </div>
          ))}
        </div>
      )}

      {mode === 'distance' && (
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#9BA8BA]">
            Plotted on a logarithmic scale (1 AU = Earth–Sun distance ≈ 149.6 million km)
          </p>
          {DISTANCE_DATA.map((item) => {
            const logPct = (Math.log10(item.km) / Math.log10(26000000000)) * 100;
            return (
              <div key={item.name} className="rounded-md border border-slate-800 bg-[#05070D] p-3.5 space-y-1.5">
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="font-semibold text-[#F4F7FB]">
                    {item.name} <span className="text-xs font-normal text-[#9BA8BA]">({item.region})</span>
                  </span>
                  <span className="font-mono text-[#E8A95B]">
                    {item.km.toLocaleString()} km · {item.auLabel}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded bg-slate-900 overflow-hidden">
                  <div className="h-full rounded bg-[#E8A95B]" style={{ width: `${Math.max(5, logPct)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mode === 'lifetime' && (
        <div className="space-y-3">
          <p className="text-xs text-[#9BA8BA]">
            Planned prime mission design warranty (slate) vs. actual operational days achieved (blue):
          </p>
          {LIFETIME_DATA.map((item) => (
            <div key={item.name} className="rounded-md border border-slate-800 bg-[#05070D] p-3.5 space-y-2">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="font-semibold text-[#F4F7FB]">{item.name}</span>
                <span className="font-mono text-[#4C9AFF]">{item.ratio}</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-24 text-slate-400">Planned: {item.designDays}d</span>
                  <div className="h-2 flex-1 rounded bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded bg-slate-500"
                      style={{ width: `${Math.max(2, (item.designDays / 18000) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-24 text-[#4C9AFF]">Actual: {item.actualDays}d</span>
                  <div className="h-2 flex-1 rounded bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded bg-[#4C9AFF]"
                      style={{ width: `${Math.max(3, (item.actualDays / 18000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === 'speed' && (
        <div className="space-y-3">
          {SPEED_DATA.map((item) => (
            <div key={item.name} className="rounded-md border border-slate-800 bg-[#05070D] p-3.5 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-[#F4F7FB]">{item.name}</span>
                <span className="font-mono text-[#E8A95B]">{item.speedKmH} km/h</span>
              </div>
              <div className="h-3 w-full rounded bg-slate-900 overflow-hidden">
                <div
                  className="h-full rounded bg-[#E8A95B]"
                  style={{ width: `${Math.max(3, (item.speedKmH / 18) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-[#9BA8BA]">{item.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
