import { useState, useEffect, useRef } from 'react';
import { Radio, Send, RotateCcw } from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

interface SignalTarget {
  id: string;
  name: string;
  distanceKm: string;
  realOneWaySec: number;
  realLabel: string;
  demoTransitSec: number;
  whyAutonomyMatters: string;
}

const TARGETS: SignalTarget[] = [
  {
    id: 'sig-moon',
    name: 'Apollo 15 / Lunokhod 1 (The Moon)',
    distanceKm: '384,400 km',
    realOneWaySec: 1.28,
    realLabel: '1.28 seconds one-way (2.56s round-trip)',
    demoTransitSec: 1.28,
    whyAutonomyMatters: 'Soviet Lunokhod drivers in Crimea saw hazards only 2.6 seconds late—allowing near-real-time joystick driving!',
  },
  {
    id: 'sig-mars-near',
    name: 'Opportunity / Perseverance (Mars Opposition)',
    distanceKm: '75,000,000 km',
    realOneWaySec: 250,
    realLabel: '4 min 10 sec one-way (8 min 20 sec round-trip)',
    demoTransitSec: 3.5,
    whyAutonomyMatters: 'Even when Mars is closest, a rover rolling toward a cliff cannot wait 8+ minutes for Earth to shout "STOP!"',
  },
  {
    id: 'sig-mars-far',
    name: 'InSight / Curiosity (Mars Far Side)',
    distanceKm: '375,000,000 km',
    realOneWaySec: 1250,
    realLabel: '20 min 50 sec one-way (41 min 40 sec round-trip)',
    demoTransitSec: 5.5,
    whyAutonomyMatters: 'Entry, Descent & Landing finishes completely before Earth even receives the signal that atmospheric entry began!',
  },
  {
    id: 'sig-saturn',
    name: 'Cassini Orbiter (Saturn)',
    distanceKm: '1,430,000,000 km',
    realOneWaySec: 4770,
    realLabel: '1 hr 19 min one-way (2 hr 38 min round-trip)',
    demoTransitSec: 7.0,
    whyAutonomyMatters: 'Cassini executed pre-uploaded ring-plane dive sequences autonomously over 2.6-hour radio echoes.',
  },
  {
    id: 'sig-voyager',
    name: 'Voyager 1 (Interstellar Space)',
    distanceKm: '25,400,000,000+ km',
    realOneWaySec: 84600,
    realLabel: '23 hr 30+ min one-way (~47 hr round-trip)',
    demoTransitSec: 8.5,
    whyAutonomyMatters: 'When JPL uploaded Voyager 1’s 2024 memory patch, engineers waited nearly two full days just to learn if it worked.',
  },
];

export function CommsDelaySimulator() {
  const [targetIdx, setTargetIdx] = useState(1);
  const [commandText, setCommandText] = useState('DRIVE FORWARD 2 METERS & SNAP NAVCAM');
  const [phase, setPhase] = useState<'idle' | 'outbound' | 'executing' | 'inbound' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { unlockBadge } = useExperience();

  const target = TARGETS[targetIdx];

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const resetSignal = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setPhase('idle');
    setProgress(0);
  };

  const launchCommand = () => {
    resetSignal();
    setPhase('outbound');
    unlockBadge('badge-deep-space');

    const stepMs = 50;
    const totalMs = target.demoTransitSec * 1000;
    let elapsed = 0;

    timerRef.current = window.setInterval(() => {
      elapsed += stepMs;
      const ratio = Math.min(1, elapsed / totalMs);
      setProgress(ratio * 100);

      if (ratio >= 1) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setPhase('executing');
        window.setTimeout(() => {
          setPhase('inbound');
          setProgress(100);
          let backElapsed = 0;
          timerRef.current = window.setInterval(() => {
            backElapsed += stepMs;
            const backRatio = Math.min(1, backElapsed / totalMs);
            setProgress((1 - backRatio) * 100);
            if (backRatio >= 1) {
              if (timerRef.current) window.clearInterval(timerRef.current);
              setPhase('done');
              setProgress(0);
            }
          }, stepMs);
        }, 700);
      }
    }, stepMs);
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Radio className="w-4 h-4" />
          <span>Communication Delay Simulator · Speed of Light = 299,792 km/s</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Transmit a Command Across the Solar System
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Even at the speed of light, commands take seconds to the Moon, minutes to Mars, and nearly a full day to reach Voyager 1. Dispatch a sample command below (time-accelerated for classroom demo beyond the Moon).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {TARGETS.map((t, idx) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              resetSignal();
              setTargetIdx(idx);
            }}
            className={`rounded-lg border p-3 text-left cursor-pointer transition-colors ${
              idx === targetIdx
                ? 'border-amber-400 bg-[#121A2C] text-white'
                : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="font-mono text-[10px] text-sky-400 tabular-nums">{t.distanceKm}</div>
            <div className="text-xs font-bold mt-0.5 leading-snug">{t.name}</div>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="text"
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            aria-label="Spacecraft command message"
            className="flex-1 rounded-md border border-slate-700 bg-[#07090E] px-3.5 py-2.5 font-mono text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
          />
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={launchCommand}
              disabled={phase === 'outbound' || phase === 'executing' || phase === 'inbound'}
              className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Command</span>
            </button>
            <button
              type="button"
              onClick={resetSignal}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2.5 text-xs text-slate-300 hover:border-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Light-Beam Propagation Track */}
        <div className="rounded-lg border border-slate-800 bg-[#06080E] p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400">EARTH DSN (GOLDSTONE)</span>
            <span className="text-slate-400 tabular-nums">
              Real Light Delay: <strong className="text-amber-300">{target.realLabel}</strong>
            </span>
            <span className="text-amber-400">{target.name.split(' (')[0].toUpperCase()}</span>
          </div>

          <div className="relative h-6 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center px-2">
            <div
              className={`h-2.5 w-6 rounded-full transition-all duration-75 ${
                phase === 'outbound'
                  ? 'bg-amber-400'
                  : phase === 'inbound'
                    ? 'bg-emerald-400'
                    : phase === 'executing'
                      ? 'bg-sky-400'
                      : 'bg-slate-600'
              }`}
              style={{
                marginLeft: `calc(${Math.max(0, Math.min(94, progress))}% )`,
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-slate-200">
              Status:{' '}
              {phase === 'idle' && 'Standby — Ready to transmit radio wave.'}
              {phase === 'outbound' && 'Outbound radio command travelling at 299,792 km/s...'}
              {phase === 'executing' && 'Spacecraft received command and executed task! Returning ACK...'}
              {phase === 'inbound' && 'Return confirmation telemetry flying back toward Earth...'}
              {phase === 'done' && 'Round-Trip Confirmation Received at Deep Space Network!'}
            </span>
            <span className="text-slate-400">
              (Educational speed-scaled beam for long planetary distances)
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
          <strong className="text-sky-400 font-mono">Why This Matters:</strong>{' '}
          {target.whyAutonomyMatters}
        </p>
      </div>
    </section>
  );
}
