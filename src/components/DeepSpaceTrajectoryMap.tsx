import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

interface RouteInfo {
  id: string;
  label: string;
  craft: string;
  status: string;
  distanceLabel: string;
  color: string;
  pathD: string;
  endX: number;
  endY: number;
  summary: string;
}

const ROUTES: RouteInfo[] = [
  {
    id: 'apollo-15',
    label: 'Earth → Moon (Apollo 15)',
    craft: 'Saturn V / Falcon / LRV-1',
    status: 'Retired on Moon (1971)',
    distanceLabel: '~384,400 km (0.0026 AU)',
    color: '#E2E8F0',
    pathD: 'M 140 210 Q 175 165 205 190',
    endX: 205,
    endY: 190,
    summary: '3-day trans-lunar trajectory to Hadley–Apennine (26.13° N, 3.63° E).',
  },
  {
    id: 'mars-transfer',
    label: 'Earth → Mars (Opportunity & InSight)',
    craft: 'MER-B / InSight',
    status: 'Retired on Mars (2018 / 2022)',
    distanceLabel: '1.52 AU orbit (~55–400M km)',
    color: '#FB923C',
    pathD: 'M 140 210 C 175 95, 290 105, 315 210',
    endX: 315,
    endY: 210,
    summary: 'Type-I Hohmann interplanetary transfer (~6.5–7 months cruise to Meridiani & Elysium).',
  },
  {
    id: 'new-horizons',
    label: 'Kuiper Belt (New Horizons)',
    craft: 'New Horizons (2006)',
    status: 'Still Travelling (Active)',
    distanceLabel: '~62+ AU (checked Nov 14, 2026)',
    color: '#38BDF8',
    pathD: 'M 140 210 Q 320 275 565 295',
    endX: 565,
    endY: 295,
    summary: 'Fastest launch from Earth; flew past Jupiter (2007), Pluto (2015), and Arrokoth (2019).',
  },
  {
    id: 'pioneer-10',
    label: 'Outer Heliosphere (Pioneer 10)',
    craft: 'Pioneer 10 (1972)',
    status: 'Silent & Travelling (last signal 2003)',
    distanceLabel: '~140 AU estimated (checked Nov 14, 2026)',
    color: '#FBBF24',
    pathD: 'M 140 210 Q 380 300 665 340',
    endX: 665,
    endY: 340,
    summary: 'First spacecraft past the Asteroid Belt and Jupiter; drifting silently toward Aldebaran.',
  },
  {
    id: 'voyager-2',
    label: 'Interstellar South (Voyager 2)',
    craft: 'Voyager 2 (1977)',
    status: 'Active & Still Travelling',
    distanceLabel: '~142 AU / ~21.2B km (est. Nov 14, 2026)',
    color: '#34D399',
    pathD: 'M 140 210 C 280 285, 450 280, 695 255',
    endX: 695,
    endY: 255,
    summary: 'Grand Tour of Jupiter, Saturn, Uranus, & Neptune; entered interstellar space Nov 2018.',
  },
  {
    id: 'voyager-1',
    label: 'Interstellar North (Voyager 1)',
    craft: 'Voyager 1 (1977)',
    status: 'Active & Still Travelling',
    distanceLabel: '~170 AU / ~25.4B km (est. Nov 14, 2026)',
    color: '#F59E0B',
    pathD: 'M 140 210 C 275 110, 470 70, 745 88',
    endX: 745,
    endY: 88,
    summary: 'Steep ~35° climb out of the ecliptic after Titan flyby; entered interstellar space Aug 2012.',
  },
];

export function DeepSpaceTrajectoryMap() {
  const { reducedMotion } = useExperience();
  const [selectedId, setSelectedId] = useState<string>('voyager-1');
  const [animating, setAnimating] = useState(!reducedMotion);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (reducedMotion) {
      setAnimating(false);
      setProgress(1);
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!animating) return;
    let start = performance.now();
    let raf = 0;
    const duration = 5000;

    const tick = (now: number) => {
      const elapsed = (now - start) % duration;
      setProgress(elapsed / duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animating]);

  const activeRoute = ROUTES.find((r) => r.id === selectedId) || ROUTES[5];

  return (
    <div className="rounded-lg border border-slate-800 bg-[#07090E] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100">
            Animated Spacecraft Journey Routes (Not to Linear Scale)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare lunar, Martian, and interstellar escape trajectories. Deep-space distances are approximate and change daily (last checked November 14, 2026).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAnimating((a) => !a)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 cursor-pointer"
          >
            {animating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{animating ? 'Pause Pulse' : 'Animate Routes'}</span>
          </button>
          <button
            type="button"
            onClick={() => setProgress(1)}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 bg-[#04060A] p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
          <svg
            viewBox="0 0 820 410"
            className="w-full h-auto"
            role="img"
            aria-label="Schematic trajectory diagram showing Moon, Mars, Pioneer, New Horizons, Voyager 1, and Voyager 2 routes"
          >
            {/* Sun & Planetary Rings (Schematic Logarithmic Scale) */}
            <circle cx="80" cy="210" r="18" fill="#F59E0B" />
            <text x="80" y="244" textAnchor="middle" fill="#FBBF24" fontSize="10" fontFamily="monospace">
              SUN
            </text>

            {/* Earth Orbit */}
            <circle cx="80" cy="210" r="60" fill="none" stroke="rgba(148,163,184,0.18)" strokeDasharray="3 4" />
            <circle cx="140" cy="210" r="7" fill="#38BDF8" />
            <text x="140" y="232" textAnchor="middle" fill="#BAE6FD" fontSize="10" fontFamily="monospace">
              EARTH (1 AU)
            </text>

            {/* Moon marker */}
            <circle cx="205" cy="190" r="4" fill="#E2E8F0" />
            <text x="205" y="178" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontFamily="monospace">
              MOON
            </text>

            {/* Mars Orbit */}
            <circle cx="80" cy="210" r="235" fill="none" stroke="rgba(251,146,60,0.22)" strokeDasharray="4 4" />
            <circle cx="315" cy="210" r="6" fill="#F97316" />
            <text x="315" y="232" textAnchor="middle" fill="#FDBA74" fontSize="10" fontFamily="monospace">
              MARS (1.5 AU)
            </text>

            {/* Kuiper Belt Band */}
            <path
              d="M 555 25 A 490 490 0 0 1 555 385"
              fill="none"
              stroke="rgba(56,189,248,0.18)"
              strokeWidth="16"
              strokeDasharray="6 6"
            />
            <text x="530" y="395" fill="#7DD3FC" fontSize="9" fontFamily="monospace">
              KUIPER BELT (~30–50 AU)
            </text>

            {/* Heliopause Boundary */}
            <path
              d="M 650 18 A 590 590 0 0 1 650 395"
              fill="none"
              stroke="rgba(245,158,11,0.35)"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
            <text x="662" y="34" fill="#FCD34D" fontSize="10" fontFamily="monospace">
              HELIOPAUSE (~120 AU) → INTERSTELLAR SPACE
            </text>

            {/* Trajectory Paths */}
            {ROUTES.map((r) => {
              const isSelected = r.id === selectedId;
              return (
                <g key={r.id} onClick={() => setSelectedId(r.id)} className="cursor-pointer">
                  <path
                    d={r.pathD}
                    fill="none"
                    stroke={r.color}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeOpacity={isSelected ? 0.95 : 0.4}
                    strokeDasharray={isSelected && animating ? '10 6' : undefined}
                    strokeDashoffset={isSelected && animating ? -progress * 160 : 0}
                  />
                  <circle
                    cx={r.endX}
                    cy={r.endY}
                    r={isSelected ? 7 : 4.5}
                    fill={r.color}
                    stroke="#04060A"
                    strokeWidth="2"
                  />
                  <text
                    x={r.endX - 6}
                    y={r.endY - 11}
                    textAnchor="end"
                    fill={r.color}
                    fontSize={isSelected ? '11' : '9.5'}
                    fontWeight={isSelected ? '700' : '500'}
                    fontFamily="monospace"
                  >
                    {r.craft.split(' (')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Route Inspector */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Select Trajectory
            </div>
            {ROUTES.map((r) => {
              const active = r.id === selectedId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={`w-full text-left rounded-md border px-3 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    active
                      ? 'border-amber-400/80 bg-[#121A2E] text-white font-semibold'
                      : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{r.label}</span>
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: r.color }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="rounded-md border border-slate-800 bg-[#0B0F18] p-4 space-y-2 text-xs">
            <div className="font-mono text-amber-400">{activeRoute.status}</div>
            <h3 className="text-sm font-bold text-slate-100">{activeRoute.craft}</h3>
            <div className="font-mono tabular-nums text-sky-300">
              {activeRoute.distanceLabel}
            </div>
            <p className="text-slate-300 leading-relaxed pt-1">{activeRoute.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
