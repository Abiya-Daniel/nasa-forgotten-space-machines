import { useState, useMemo } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { useExperience } from '../context/ExperienceContext';

type DestinationId = 'moon' | 'mars' | 'asteroid' | 'jupiter' | 'saturn' | 'deep-space';
type PowerId = 'solar' | 'battery' | 'fuel-cell' | 'rtg';
type MobilityId = 'wheels' | 'stationary' | 'flyby';
type CommsId = 's-band' | 'relay' | 'high-gain' | 'optical';

const INSTRUMENTS = [
  { id: 'camera', label: 'Panoramic Stereo Camera', watts: 22, mass: 12 },
  { id: 'seismometer', label: 'Deep Interior Seismometer', watts: 18, mass: 29 },
  { id: 'spectrometer', label: 'X-Ray & Alpha Spectrometer', watts: 16, mass: 9 },
  { id: 'drill', label: 'Core & Soil Drill', watts: 38, mass: 24 },
  { id: 'thermal', label: 'Thermal Flow Probe', watts: 15, mass: 11 },
  { id: 'radiation', label: 'Radiation & Magnetometer', watts: 14, mass: 13 },
  { id: 'atmo', label: 'Atmospheric Pressure & Dust Sensor', watts: 12, mass: 8 },
  { id: 'retroreflector', label: 'Passive Laser Retroreflector', watts: 0, mass: 24 },
];

export function BuildSpacecraftLab() {
  const [destination, setDestination] = useState<DestinationId>('mars');
  const [power, setPower] = useState<PowerId>('solar');
  const [mobility, setMobility] = useState<MobilityId>('wheels');
  const [comms, setComms] = useState<CommsId>('high-gain');
  const [payloadIds, setPayloadIds] = useState<string[]>(['camera', 'spectrometer', 'atmo']);
  const [tested, setTested] = useState(false);

  const { unlockBadge, recordSimCompletion } = useExperience();

  const togglePayload = (id: string) => {
    setTested(false);
    setPayloadIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const evaluation = useMemo(() => {
    const baseMass =
      mobility === 'wheels' ? 185 : mobility === 'stationary' ? 240 : 510;
    const powerMass =
      power === 'rtg' ? 58 : power === 'fuel-cell' ? 68 : power === 'solar' ? 35 : 42;
    const commsMass =
      comms === 'high-gain' ? 42 : comms === 'optical' ? 32 : comms === 'relay' ? 24 : 14;
    const payloadMass = INSTRUMENTS.filter((i) => payloadIds.includes(i.id)).reduce(
      (sum, i) => sum + i.mass,
      0
    );
    const totalMass = baseMass + powerMass + commsMass + payloadMass;

    const solarByDest: Record<DestinationId, number> = {
      moon: 260,
      mars: 145,
      asteroid: 80,
      jupiter: 18,
      saturn: 8,
      'deep-space': 2,
    };

    const powerSupplyW =
      power === 'rtg'
        ? 290
        : power === 'fuel-cell'
          ? 240
          : power === 'solar'
            ? solarByDest[destination]
            : 120;

    const powerDrawW =
      (mobility === 'wheels' ? 55 : mobility === 'flyby' ? 45 : 22) +
      (comms === 'high-gain' ? 45 : comms === 'optical' ? 40 : 24) +
      INSTRUMENTS.filter((i) => payloadIds.includes(i.id)).reduce(
        (sum, i) => sum + i.watts,
        0
      );

    const issues: string[] = [];
    const strengths: string[] = [];

    const isOuter =
      destination === 'jupiter' || destination === 'saturn' || destination === 'deep-space';

    if (isOuter && power === 'solar') {
      issues.push(
        `Sunlight at ${destination.toUpperCase()} follows the inverse-square law (27× to 900× weaker than Earth). Solar panels cannot sustain your instruments—switch to Plutonium-238 RTG.`
      );
    }
    if ((destination === 'jupiter' || destination === 'saturn' || destination === 'deep-space') && mobility === 'wheels') {
      issues.push(
        'Gas giants and interstellar trajectories have no solid surface for wheeled rovers—choose a Deep Space Flyby / Orbiter Bus.'
      );
    }
    if (destination === 'asteroid' && mobility === 'wheels') {
      issues.push(
        'Small asteroids have micro-gravity (<0.001 g): wheeled rovers would float off the surface on the first bump! Use an Orbiter/Touch-and-Go Bus.'
      );
    }
    if ((destination === 'moon' || destination === 'mars') && power === 'fuel-cell') {
      strengths.push(
        'Fuel cells deliver strong short-term power (up to ~14 days, as on Apollo) before reactant tanks run dry.'
      );
    }
    if (destination === 'moon' && power === 'battery') {
      strengths.push(
        'Silver-zinc non-rechargeable batteries mirror Apollo 15 LRV-1—ideal for intense multi-day lunar traverses.'
      );
    }
    if (destination === 'mars' && power === 'battery') {
      issues.push(
        'Primary batteries alone restrict a Martian mission to just days; select Solar Arrays or a Nuclear RTG for multi-year survival.'
      );
    }
    if (isOuter && comms === 's-band') {
      issues.push(
        'A tiny low-gain whip antenna cannot return science telemetry across billions of km—choose a 3.7m High-Gain Parabolic Dish or Optical Laser Comms.'
      );
    }
    if (destination === 'jupiter' && !payloadIds.includes('radiation')) {
      issues.push(
        'Jupiter’s intense Van Allen radiation belts demand a Radiation & Magnetometer sensor to monitor electronics shielding.'
      );
    }
    if (powerDrawW > powerSupplyW) {
      issues.push(
        `Power deficit: subsystems require ${powerDrawW} W while power source generates ${powerSupplyW} W at this target.`
      );
    }
    if (power === 'rtg' && (destination === 'mars' || isOuter)) {
      strengths.push(
        'Plutonium-238 RTG provides continuous heat and electricity impervious to Martian dust storms and outer-system darkness.'
      );
    }
    if (comms === 'optical' && issues.length === 0) {
      strengths.push(
        'Deep-Space Optical Laser Communication boosts bandwidth 10×+ over traditional radio links (as tested on NASA Psyche).'
      );
    }

    const complexityScore = Math.min(
      100,
      Math.round(
        payloadIds.length * 9 +
          (isOuter ? 28 : destination === 'asteroid' ? 24 : 16) +
          (mobility === 'wheels' ? 18 : 10)
      )
    );

    const ready = issues.length === 0;
    return {
      totalMass,
      powerSupplyW,
      powerDrawW,
      issues,
      strengths,
      ready,
      complexityScore,
    };
  }, [destination, power, mobility, comms, payloadIds]);

  const handleRunTest = () => {
    setTested(true);
    unlockBadge('badge-spacecraft-engineer');
    recordSimCompletion('spacecraft-builder');
  };

  return (
    <section className="no-print space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Wrench className="w-4 h-4" />
            <span>Expanded Mission Architecture Studio · 6 Worlds &amp; 8 Science Payloads</span>
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-100">
            Build &amp; Stress-Test Your Own Deep-Space Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Balance inverse-square sunlight, radiation belts, landing mechanics, drills, sensors, and communication bandwidth across six Solar System destinations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDestination('mars');
            setPower('solar');
            setMobility('wheels');
            setComms('high-gain');
            setPayloadIds(['camera', 'spectrometer', 'atmo']);
            setTested(false);
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Blueprint</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5 rounded-lg border border-slate-800 bg-[#0B0F18] p-5">
          {/* 1. Destination */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              1. Target Destination (6 Worlds)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'moon', label: 'The Moon (1.3s Delay)' },
                  { id: 'mars', label: 'Mars Surface (Dust + Wind)' },
                  { id: 'asteroid', label: 'Asteroid (Microgravity)' },
                  { id: 'jupiter', label: 'Jupiter (Extreme Radiation)' },
                  { id: 'saturn', label: 'Saturn System (90× Dimmer Sun)' },
                  { id: 'deep-space', label: 'Deep Space / Interstellar' },
                ] as { id: DestinationId; label: string }[]
              ).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDestination(d.id);
                    setTested(false);
                  }}
                  className={`rounded-md border p-2.5 text-left text-xs font-medium cursor-pointer transition-colors ${
                    destination === d.id
                      ? 'border-amber-400 bg-[#121A2C] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Power Source */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              2. Electrical Power Source
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'solar', label: 'Solar Panels' },
                  { id: 'battery', label: 'Primary Batteries' },
                  { id: 'fuel-cell', label: 'Hydrogen Fuel Cell' },
                  { id: 'rtg', label: 'Plutonium-238 RTG' },
                ] as { id: PowerId; label: string }[]
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPower(p.id);
                    setTested(false);
                  }}
                  className={`rounded-md border p-2.5 text-left text-xs font-medium cursor-pointer transition-colors ${
                    power === p.id
                      ? 'border-amber-400 bg-[#121A2C] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Mobility */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              3. Chassis &amp; Mobility
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'wheels', label: '6-Wheel Rover Chassis' },
                  { id: 'stationary', label: 'Tripod Surface Lander' },
                  { id: 'flyby', label: 'Deep Space Flyby / Orbiter' },
                ] as { id: MobilityId; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMobility(m.id);
                    setTested(false);
                  }}
                  className={`rounded-md border p-2.5 text-left text-xs font-medium cursor-pointer transition-colors ${
                    mobility === m.id
                      ? 'border-amber-400 bg-[#121A2C] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Communications */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              4. Communication System
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 's-band', label: 'Compact Whip' },
                  { id: 'relay', label: 'UHF Orbiter Relay' },
                  { id: 'high-gain', label: '3.7m High-Gain Dish' },
                  { id: 'optical', label: 'Optical Laser Comms' },
                ] as { id: CommsId; label: string }[]
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setComms(c.id);
                    setTested(false);
                  }}
                  className={`rounded-md border p-2.5 text-left text-xs font-medium cursor-pointer transition-colors ${
                    comms === c.id
                      ? 'border-amber-400 bg-[#121A2C] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Scientific Instruments */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              5. Scientific Instruments (Select 1 or more)
            </div>
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTS.map((inst) => {
                const active = payloadIds.includes(inst.id);
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => togglePayload(inst.id)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                      active
                        ? 'border-sky-400 bg-sky-950/40 text-sky-200'
                        : 'border-slate-800 bg-[#07090E] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {inst.label} ({inst.watts}W · {inst.mass}kg)
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Telemetry Readout & Launch Test */}
        <div className="lg:col-span-5 rounded-lg border border-slate-800 bg-[#0B0F18] p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <div className="font-mono text-xs text-amber-400">Vehicle Engineering Summary</div>
            <h3 className="text-lg font-bold text-slate-100 mt-0.5">
              Mass, Power &amp; Complexity Budget
            </h3>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Dry Mass</dt>
              <dd className="mt-1 font-mono text-base font-bold text-slate-100 tabular-nums">
                {evaluation.totalMass} kg
              </dd>
            </div>
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Available</dt>
              <dd className="mt-1 font-mono text-base font-bold text-emerald-400 tabular-nums">
                {evaluation.powerSupplyW} W
              </dd>
            </div>
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Demand</dt>
              <dd
                className={`mt-1 font-mono text-base font-bold tabular-nums ${
                  evaluation.powerDrawW > evaluation.powerSupplyW
                    ? 'text-rose-400'
                    : 'text-sky-300'
                }`}
              >
                {evaluation.powerDrawW} W
              </dd>
            </div>
            <div className="rounded border border-slate-800 bg-[#07090E] p-3">
              <dt className="text-slate-400">Complexity</dt>
              <dd className="mt-1 font-mono text-base font-bold text-amber-300 tabular-nums">
                {evaluation.complexityScore}/100
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleRunTest}
            className="w-full rounded-md bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Run Mission Simulation &amp; Check Survivability
          </button>

          {tested && (
            <div
              className={`rounded-md border p-4 space-y-2 text-xs sm:text-sm ${
                evaluation.ready
                  ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-100'
                  : 'border-amber-500/60 bg-[#181214] text-amber-100'
              }`}
            >
              <div className="inline-flex items-center gap-2 font-bold">
                {evaluation.ready ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {evaluation.ready
                    ? 'Flight Readiness Passed! Configuration Balanced.'
                    : 'Design Warnings Detected — Engineering Revision Needed'}
                </span>
              </div>

              {evaluation.issues.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-xs text-rose-200">
                  {evaluation.issues.map((iss, i) => (
                    <li key={i}>{iss}</li>
                  ))}
                </ul>
              )}

              {evaluation.strengths.length > 0 && (
                <ul className="list-disc pl-5 space-y-1 text-xs text-emerald-200">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
