import { useState } from 'react';
import { EQUIPMENT_DATA } from '../data/equipmentData';

export function WhyLeftBehindPage() {
  const [payloadMassKg, setPayloadMassKg] = useState<number>(210); // Default: Apollo LRV (210 kg)
  const [targetWorld, setTargetWorld] = useState<'moon' | 'mars'>('mars');

  // Educational Tsiolkovsky Rocket Equation estimate (representative staging assumptions):
  // Returning 1 kg from the surface requires ascent delta-v + Earth transit + aerocapture/entry,
  // compounding exponentially through launch-from-Earth stages.
  // Typical rough orbital gear-ratio multipliers (illustrative engineering physics):
  // Moon surface round-trip return gear ratio ~ 25:1 to 40:1 extra Earth-launch mass per kg returned.
  // Mars surface round-trip return gear ratio ~ 150:1 to 250:1 extra Earth-launch mass per kg returned (without ISRU).
  const deltaVReturnKmS = targetWorld === 'moon' ? 2.6 : 6.1; // Surface -> Earth return trajectory approx
  const earthLaunchMultiplier = targetWorld === 'moon' ? 32 : 185;
  const extraEarthLaunchMassKg = payloadMassKg * earthLaunchMultiplier;

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-3xl">
        <p className="text-xs font-mono uppercase tracking-wider text-orange-400">
          Orbital Physics, Harsh Environments &amp; Space Heritage
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
          Why Do We Leave Equipment Behind?
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
          Leaving rovers, descent stages, and landers on the Moon and Mars is
          not carelessness—it is dictated by the tyranny of the rocket equation,
          extreme planetary environments, and deliberate mission engineering.
        </p>
      </div>

      {/* Interactive Rocket Equation / Return Mass Penalty Explorer */}
      <section className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                01. Cost &amp; The Rocket Equation Return Penalty
              </h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Every kilogram you bring back from another world requires fuel
                to lift off that world—and you had to burn vastly more fuel on
                Earth just to carry that return fuel across space in the first
                place. Experiment with hardware mass below to see why return
                missions prioritize grams of rock samples instead of heavy
                rovers.
              </p>
            </div>

            <div className="space-y-4 rounded-md border border-slate-800 bg-[#07090E] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-300">
                  Target Surface
                </span>
                <div className="inline-flex rounded border border-slate-800 bg-[#0B0F18] p-0.5">
                  <button
                    type="button"
                    onClick={() => setTargetWorld('moon')}
                    className={`rounded px-3 py-1 text-xs font-medium cursor-pointer ${
                      targetWorld === 'moon'
                        ? 'bg-slate-100 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    The Moon
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetWorld('mars')}
                    className={`rounded px-3 py-1 text-xs font-medium cursor-pointer ${
                      targetWorld === 'mars'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Mars
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <label htmlFor="mass-slider" className="text-slate-300">
                    Hardware Mass to Recover
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-orange-400">
                    {payloadMassKg.toLocaleString()} kg
                  </span>
                </div>
                <input
                  id="mass-slider"
                  type="range"
                  min={10}
                  max={1050}
                  step={5}
                  value={payloadMassKg}
                  onChange={(e) => setPayloadMassKg(Number(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPayloadMassKg(11)}
                    className="rounded border border-slate-800 px-2 py-1 text-slate-300 hover:border-slate-600 cursor-pointer"
                  >
                    Sojourner (~11 kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayloadMassKg(210)}
                    className="rounded border border-slate-800 px-2 py-1 text-slate-300 hover:border-slate-600 cursor-pointer"
                  >
                    Apollo LRV (210 kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayloadMassKg(1025)}
                    className="rounded border border-slate-800 px-2 py-1 text-slate-300 hover:border-slate-600 cursor-pointer"
                  >
                    Perseverance (1,025 kg)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-md border border-slate-800 bg-[#07090E] p-4">
                <div className="text-xs text-slate-400">
                  Minimum Return Delta-v (approx.)
                </div>
                <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-slate-100">
                  ~{deltaVReturnKmS.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-slate-400">km/s</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Ascent to orbit + trans-Earth injection (ignoring atmospheric entry heat shield mass).
                </p>
              </div>

              <div className="rounded-md border border-slate-800 bg-[#07090E] p-4">
                <div className="text-xs text-slate-400">
                  Illustrative Earth-Launch Gear Ratio
                </div>
                <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-orange-400">
                  ~{earthLaunchMultiplier}:1
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Approximate extra launch mass on Earth per kg returned without in-situ propellant production.
                </p>
              </div>
            </div>

            <div className="rounded-md border border-slate-800 bg-[#07090E] p-5">
              <div className="text-xs text-slate-400">
                Estimated Additional Earth-Launch Mass Required
              </div>
              <div className="mt-1 text-3xl font-bold font-mono tabular-nums text-slate-100">
                ~{(extraEarthLaunchMassKg / 1000).toFixed(1)}{' '}
                <span className="text-sm font-normal text-slate-400">
                  metric tons ({extraEarthLaunchMassKg.toLocaleString()} kg)
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                For context, NASA&apos;s entire Apollo Lunar Module ascent stage
                returned ~100 kg of lunar rocks per flight—never the 2,000+ kg
                descent stage or 210 kg rover. Even today&apos;s Mars Sample
                Return architectures aim to lift just ~0.5 kg of sealed rock
                tubes, leaving the 1,025 kg Perseverance rover on Mars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental & Engineering Factors */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6">
          <h2 className="text-lg font-bold text-slate-100">
            02. Extreme Thermal Cycling
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Without a thick stabilizing atmosphere, surface temperatures swing
            violently. Equatorial lunar surfaces swing from roughly +120 °C in
            direct sunlight to -170 °C at night; Martian winters drop below
            -125 °C at high latitudes (freezing Phoenix under dry-ice frost).
            Once survival heaters lose battery or solar power, solder joints,
            wiring, and seals experience severe thermal contraction.
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6">
          <h2 className="text-lg font-bold text-slate-100">
            03. Radiation &amp; Abrasive Planetary Dust
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Lunar regolith consists of microscopic, razor-sharp silicate glass
            shards formed by micrometeoroid impacts—clinging electrostatically to
            bearings, seals, and radiators. On Mars, fine iron-oxide dust slowly
            coats solar arrays (ending Opportunity and InSight) while solar UV
            and cosmic radiation degrade polymers and unshielded electronics.
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6">
          <h2 className="text-lg font-bold text-slate-100">
            04. Mechanical &amp; Power Degradation
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Primary silver-zinc batteries on the Apollo LRVs were non-rechargeable;
            nickel-cadmium batteries on Viking 2 eventually lost capacity; Mars’s
            thin dust storms robbed solar-powered landers of sunlight; and
            Ingenuity’s carbon-fiber rotors fractured upon striking sand ripples on
            Flight 72.
          </p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6">
          <h2 className="text-lg font-bold text-slate-100">
            05. Scientific &amp; Historical Heritage Value
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Far from &ldquo;trash,&rdquo; these machines are active benchmarks
            and irreplaceable monuments. Apollo retroreflectors still return
            Earth laser measurements after 55+ years, Surveyor 3 taught engineers
            how materials weather on the Moon, and U.S. law protects Apollo
            landing sites as human spaceflight heritage.
          </p>
        </article>
      </section>

      {/* Mandatory Separation: Established Facts vs Future Possibilities */}
      <section className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-100">
          06. Scientific Facts vs. Future Exploration Possibilities
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Distinguishing verified historical/scientific observations from
          forward-looking exploration concepts.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-md border border-slate-800 bg-[#07090E] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-emerald-400">
              ● Established Scientific &amp; Historical Facts
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
              <li>
                Apollo 11, 14, and 15 Laser Ranging Retroreflectors remain
                actively tracked from Earth observatories today.
              </li>
              <li>
                Apollo 12 astronauts retrieved Surveyor 3’s camera in 1969,
                proving hardware could survive 31 months of lunar vacuum and
                thermal extremes.
              </li>
              <li>
                NASA’s LRO and MRO HiRISE cameras regularly photograph Apollo
                descent stages, rover tracks, Viking, Spirit, Beagle 2, and
                Schiaparelli from orbit.
              </li>
              <li>
                Currently documented hardware across our catalog spans{' '}
                <span className="font-mono tabular-nums">
                  {EQUIPMENT_DATA.length}
                </span>{' '}
                major Moon and Mars sites.
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#07090E] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-orange-400">
              ◆ Future Exploration Possibilities (Speculative / Planned)
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
              <li>
                Future Artemis rovers or robotic probes could inspect the Apollo
                15–17 LRVs at safe standoff distances to study 50+ years of
                battery, tire, and polymer aging.
              </li>
              <li>
                Mars astronauts might someday visit Viking, Pathfinder, or
                Ingenuity as protected planetary heritage parks—or carefully
                return lightweight relics like the 1.8 kg Ingenuity helicopter.
              </li>
              <li>
                Discarded entry stages and solar arrays could eventually inform
                in-situ recycling concepts if sustainable off-world bases are
                established, subject to planetary protection and heritage laws.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
