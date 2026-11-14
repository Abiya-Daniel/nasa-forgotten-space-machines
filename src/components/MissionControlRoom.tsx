import { useState } from 'react';
import { Activity, ShieldCheck, Radio, Zap, RotateCcw } from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

interface ConsoleDecision {
  id: string;
  station: string;
  alert: string;
  options: { label: string; optimal: boolean; effect: string }[];
}

const CONSOLE_EVENTS: ConsoleDecision[] = [
  {
    id: 'mc-flight',
    station: 'FLIGHT DYNAMICS (FIDO)',
    alert: 'Mars Rover wheel current spiked +42% in soft sulfate sand (Purgatory-style ripple).',
    options: [
      { label: 'Command 20 cm high-torque full-throttle climb forward', optimal: false, effect: 'Wheels dug 6 cm deeper into loose dust; slip ratio reached 95%.' },
      { label: 'Halt immediately, run visual odometry check & test on Earth sandbox', optimal: true, effect: 'Rover stabilized! Safe millimeter-step extraction sequence loaded for next sol.' },
    ],
  },
  {
    id: 'mc-power',
    station: 'POWER & THERMAL (EECOM)',
    alert: 'Regional Martian dust storm raised atmospheric opacity (tau) to 5.8; battery overnight reserve falling.',
    options: [
      { label: 'Keep Panoramic Camera heaters & high-rate telemetry running continuously', optimal: false, effect: 'Critical bus voltage brownout risked flight-clock reset.' },
      { label: 'Enter low-power fault-protection sleep, shed science heaters & wait for tau drop', optimal: true, effect: 'Minimal survival power preserved across storm peak while core electronics stayed warm.' },
    ],
  },
  {
    id: 'mc-dsn',
    station: 'DEEP SPACE NETWORK (GOLDSTONE 70M)',
    alert: 'Voyager 1 downlink carrier is -158 dBm; Sun-Earth-Mars conjunction begins in 48 hours.',
    options: [
      { label: 'Link twin 34 m + 70 m antennas into coherent array & freeze Mars driving commands', optimal: true, effect: 'Clean carrier lock achieved on Voyager 1 while Martian surface rovers sit safely in autonomous idle.' },
      { label: 'Transmit high-speed driving waypoints straight through solar corona plasma', optimal: false, effect: 'Coronal scintillation scrambled packet checksums; onboard receiver rejected unsafe frame.' },
    ],
  },
];

export function MissionControlRoom() {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const { unlockBadge } = useExperience();

  const resolvedCount = Object.keys(selected).length;
  const optimalCount = CONSOLE_EVENTS.filter(
    (ev) => selected[ev.id] !== undefined && ev.options[selected[ev.id]]?.optimal
  ).length;

  const choose = (id: string, idx: number) => {
    const next = { ...selected, [id]: idx };
    setSelected(next);
    if (Object.keys(next).length === CONSOLE_EVENTS.length) {
      unlockBadge('badge-mission-controller');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <Activity className="w-4 h-4" />
            <span>Mission Control Room · Flight Director Decision Consoles</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Command the Deep Space Operations Floor
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Step into three real-world inspired stations—Flight Dynamics, Power/Thermal, and Deep Space Network—to guide active and vulnerable spacecraft safely through surface and signal hazards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-md border border-slate-800 bg-[#0B0F18] px-3.5 py-2 font-mono text-xs text-slate-200 tabular-nums">
            Stations Cleared: <span className="text-amber-400">{optimalCount}/{CONSOLE_EVENTS.length}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelected({})}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Floor</span>
          </button>
        </div>
      </div>

      {/* Simulated Station Status Ribbon (Static Typography, Zero Pulsing Dots) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex items-center justify-between">
          <span className="text-slate-400">FIDO MOBILITY CONSOLE</span>
          <span className="text-sky-400 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> READY
          </span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex items-center justify-between">
          <span className="text-slate-400">EECOM POWER BUS</span>
          <span className="text-amber-400 inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> MONITOR
          </span>
        </div>
        <div className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5 flex items-center justify-between">
          <span className="text-slate-400">DSN 70M ANTENNA LINK</span>
          <span className="text-emerald-400 inline-flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" /> LOCKED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {CONSOLE_EVENTS.map((ev) => {
          const pickedIdx = selected[ev.id];
          const pickedOpt = pickedIdx !== undefined ? ev.options[pickedIdx] : null;
          return (
            <article
              key={ev.id}
              className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="font-mono text-xs text-sky-400">{ev.station}</div>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {ev.alert}
                </p>

                <div className="space-y-2 pt-1">
                  {ev.options.map((opt, idx) => {
                    const isSel = pickedIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => choose(ev.id, idx)}
                        className={`w-full rounded-md border p-3 text-left text-xs leading-relaxed cursor-pointer transition-colors ${
                          isSel
                            ? opt.optimal
                              ? 'border-emerald-500 bg-emerald-950/30 text-emerald-100'
                              : 'border-rose-500 bg-rose-950/30 text-rose-100'
                            : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-amber-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {pickedOpt && (
                <div
                  className={`rounded-md border p-3 text-xs leading-relaxed ${
                    pickedOpt.optimal
                      ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                      : 'border-amber-500/40 bg-[#181214] text-amber-200'
                  }`}
                >
                  <strong>Console Log:</strong> {pickedOpt.effect}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {resolvedCount === CONSOLE_EVENTS.length && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 px-4 py-3 text-xs text-emerald-200">
          All three Mission Control stations completed ({optimalCount}/3 optimal decisions). Flight Director badge progress recorded.
        </div>
      )}
    </section>
  );
}
