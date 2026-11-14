import { useState, useEffect, useRef } from 'react';
import { Rocket, RotateCcw, Flame, Umbrella } from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

type LandingBody = 'moon' | 'mars' | 'titan';

const BODY_PROFILES: Record<
  LandingBody,
  {
    name: string;
    gravity: number;
    hasAtmos: boolean;
    hasHeatShield: boolean;
    startAlt: number;
    startVel: number;
    safeVel: number;
    note: string;
  }
> = {
  moon: {
    name: 'The Moon (Vacuum Powered Descent)',
    gravity: 1.62,
    hasAtmos: false,
    hasHeatShield: false,
    startAlt: 1200,
    startVel: 48,
    safeVel: 4.5,
    note: 'No air exists on the Moon—parachutes do nothing! Control your retro-engine throttle carefully to touch down under 4.5 m/s.',
  },
  mars: {
    name: 'Mars ("7 Minutes of Terror" EDL)',
    gravity: 3.72,
    hasAtmos: true,
    hasHeatShield: true,
    startAlt: 1800,
    startVel: 95,
    safeVel: 5.0,
    note: 'Mars air is ~1% of Earth’s: wait for altitude < 1,200 m to open the supersonic parachute, drop the heat shield, then pulse retro-rockets below 350 m.',
  },
  titan: {
    name: 'Titan (Huygens Thick Nitrogen Entry)',
    gravity: 1.35,
    hasAtmos: true,
    hasHeatShield: true,
    startAlt: 1600,
    startVel: 72,
    safeVel: 6.0,
    note: 'Titan’s dense nitrogen haze slows probes dramatically once your parachute deploys below 1,300 m—plus low 0.14g gravity makes final descent gentle.',
  },
};

export function SurviveLandingSim() {
  const [body, setBody] = useState<LandingBody>('mars');
  const [running, setRunning] = useState(false);
  const [altitude, setAltitude] = useState(BODY_PROFILES.mars.startAlt);
  const [velocity, setVelocity] = useState(BODY_PROFILES.mars.startVel);
  const [fuel, setFuel] = useState(100);
  const [chuteOpen, setChuteOpen] = useState(false);
  const [shieldDropped, setShieldDropped] = useState(false);
  const [thrusting, setThrusting] = useState(false);
  const [outcome, setOutcome] = useState<'none' | 'landed' | 'crashed'>('none');

  const stateRef = useRef({
    alt: BODY_PROFILES.mars.startAlt,
    vel: BODY_PROFILES.mars.startVel,
    fuel: 100,
    chute: false,
    shieldDropped: false,
    thrust: false,
  });

  const { unlockBadge, recordSimCompletion } = useExperience();
  const profile = BODY_PROFILES[body];

  const resetSim = (nextBody: LandingBody = body) => {
    const p = BODY_PROFILES[nextBody];
    stateRef.current = {
      alt: p.startAlt,
      vel: p.startVel,
      fuel: 100,
      chute: false,
      shieldDropped: !p.hasHeatShield,
      thrust: false,
    };
    setRunning(false);
    setAltitude(p.startAlt);
    setVelocity(p.startVel);
    setFuel(100);
    setChuteOpen(false);
    setShieldDropped(!p.hasHeatShield);
    setThrusting(false);
    setOutcome('none');
  };

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      const s = stateRef.current;
      const dt = 0.08;

      // Drag from atmosphere / parachute
      let drag = 0;
      if (profile.hasAtmos) {
        drag = body === 'titan' ? s.vel * 0.04 : s.vel * 0.015;
        if (s.chute) {
          drag += body === 'titan' ? s.vel * 0.35 : s.vel * 0.14;
        }
      }

      // Retro-thrust (only after heat shield dropped and fuel > 0)
      let thrustDecel = 0;
      if (s.thrust && s.fuel > 0 && s.shieldDropped) {
        thrustDecel = 12.5;
        s.fuel = Math.max(0, s.fuel - dt * 15);
      }

      s.vel = Math.max(0, s.vel + (profile.gravity - drag - thrustDecel) * dt);
      s.alt = Math.max(0, s.alt - s.vel * dt);

      setAltitude(Math.round(s.alt));
      setVelocity(Math.round(s.vel * 10) / 10);
      setFuel(Math.round(s.fuel));

      if (s.alt <= 0) {
        setRunning(false);
        const safe = s.vel <= profile.safeVel && s.shieldDropped;
        setOutcome(safe ? 'landed' : 'crashed');
        if (safe) {
          if (body === 'mars') unlockBadge('badge-mars-pioneer');
          if (body === 'moon') unlockBadge('badge-moon-explorer');
          recordSimCompletion(`landing-${body}`);
        }
      }
    }, 80);

    return () => window.clearInterval(interval);
  }, [running, body, profile, unlockBadge, recordSimCompletion]);

  const deployChute = () => {
    if (!profile.hasAtmos || stateRef.current.chute) return;
    stateRef.current.chute = true;
    setChuteOpen(true);
  };

  const dropHeatShield = () => {
    if (!profile.hasHeatShield || stateRef.current.shieldDropped) return;
    stateRef.current.shieldDropped = true;
    setShieldDropped(true);
  };

  const altPct = Math.min(100, Math.max(0, (altitude / profile.startAlt) * 100));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Rocket className="w-4 h-4" />
            <span>Survive the Landing · Entry, Descent &amp; Landing Physics Lab</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Touch Down Safely on the Moon, Mars, or Titan
          </h2>
        </div>

        <button
          type="button"
          onClick={() => resetSim(body)}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3.5 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Descent</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['moon', 'mars', 'titan'] as LandingBody[]).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => {
              setBody(b);
              resetSim(b);
            }}
            className={`rounded-md px-3.5 py-2 text-xs font-semibold cursor-pointer ${
              body === b
                ? 'bg-sky-500 text-slate-950'
                : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
            }`}
          >
            {BODY_PROFILES[b].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Visual Vertical Descent Column */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#06080E] p-5 flex flex-col justify-between min-h-[340px]">
          <div className="flex items-center justify-between text-xs font-mono text-sky-400">
            <span>VERTICAL DESCENT VIEW</span>
            <span>Safe Touchdown &lt;= {profile.safeVel} m/s</span>
          </div>

          <div className="relative flex-1 my-4 rounded-lg border border-slate-800 bg-gradient-to-b from-[#070B16] via-[#101626] to-[#23140E] overflow-hidden">
            {/* Spacecraft Marker */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-[bottom] duration-75"
              style={{ bottom: `${Math.max(8, altPct * 0.78 + 8)}%` }}
            >
              {chuteOpen && (
                <div className="w-12 h-5 rounded-t-full border-2 border-amber-300 bg-amber-500/30 mb-1" />
              )}
              <div className="w-6 h-5 rounded bg-slate-200 border border-amber-400 flex items-center justify-center text-[9px] font-bold text-slate-950">
                EDL
              </div>
              {!shieldDropped && (
                <div className="w-8 h-1.5 rounded-b-full bg-orange-500 mt-0.5" />
              )}
              {thrusting && fuel > 0 && shieldDropped && (
                <div className="w-3 h-4 bg-gradient-to-b from-amber-300 to-orange-600 rounded-b-full" />
              )}
            </div>

            {/* Surface Ground */}
            <div
              className={`absolute bottom-0 inset-x-0 h-5 border-t ${
                body === 'moon'
                  ? 'bg-slate-700 border-slate-500'
                  : body === 'titan'
                    ? 'bg-amber-950 border-amber-700'
                    : 'bg-[#5c2817] border-orange-500/60'
              }`}
            />
          </div>

          <p className="text-xs text-slate-400">{profile.note}</p>
        </div>

        {/* Flight Control & Telemetry Panel */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F18] p-6 flex flex-col justify-between space-y-5">
          <dl className="grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400">Altitude</dt>
              <dd className="mt-1 font-mono text-2xl font-bold text-white tabular-nums">
                {altitude} m
              </dd>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400">Descent Speed</dt>
              <dd
                className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
                  velocity <= profile.safeVel ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                {velocity.toFixed(1)} m/s
              </dd>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5">
              <dt className="text-slate-400">Retro Fuel</dt>
              <dd
                className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
                  fuel < 20 ? 'text-rose-400' : 'text-sky-300'
                }`}
              >
                {fuel}%
              </dd>
            </div>
          </dl>

          <div className="space-y-3">
            {!running && outcome === 'none' && (
              <button
                type="button"
                onClick={() => setRunning(true)}
                className="w-full rounded-md bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                Begin Atmospheric Entry / Powered Descent
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {profile.hasAtmos && (
                <button
                  type="button"
                  disabled={!running || chuteOpen || altitude > 1400}
                  onClick={deployChute}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sky-500/60 bg-[#0D1829] px-3 py-3 text-xs font-semibold text-sky-200 hover:bg-sky-900/40 disabled:opacity-40 cursor-pointer"
                >
                  <Umbrella className="w-4 h-4" />
                  <span>{chuteOpen ? 'Parachute Open' : 'Deploy Parachute (<1.4km)'}</span>
                </button>
              )}

              {profile.hasHeatShield && (
                <button
                  type="button"
                  disabled={!running || shieldDropped}
                  onClick={dropHeatShield}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-amber-500/60 bg-[#19130C] px-3 py-3 text-xs font-semibold text-amber-200 hover:bg-amber-900/30 disabled:opacity-40 cursor-pointer"
                >
                  <span>{shieldDropped ? 'Heat Shield Jettisoned' : 'Drop Heat Shield'}</span>
                </button>
              )}

              <button
                type="button"
                disabled={!running || !shieldDropped || fuel <= 0}
                onPointerDown={() => {
                  stateRef.current.thrust = true;
                  setThrusting(true);
                }}
                onPointerUp={() => {
                  stateRef.current.thrust = false;
                  setThrusting(false);
                }}
                onPointerLeave={() => {
                  stateRef.current.thrust = false;
                  setThrusting(false);
                }}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-3 text-xs font-semibold cursor-pointer select-none ${
                  thrusting
                    ? 'bg-orange-500 text-slate-950'
                    : 'border border-orange-500/60 bg-[#1C0E0A] text-orange-200 hover:bg-orange-950/50 disabled:opacity-40'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>HOLD Retro-Thrusters</span>
              </button>
            </div>
          </div>

          {outcome !== 'none' && (
            <div
              className={`rounded-lg border p-4 text-xs sm:text-sm ${
                outcome === 'landed'
                  ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-100'
                  : 'border-rose-500/60 bg-rose-950/20 text-rose-100'
              }`}
            >
              <strong>
                {outcome === 'landed'
                  ? `Safe Touchdown! Speed ${velocity.toFixed(1)} m/s with ${fuel}% fuel left.`
                  : `Hard Impact at ${velocity.toFixed(1)} m/s${
                      !shieldDropped ? ' (Heat shield was still blocking retro-thrusters!)' : '.'
                    }`}
              </strong>
              <p className="mt-1 text-xs opacity-90">
                Try another planet or reset descent to refine your fuel and parachute timing.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
