import { useState } from 'react';
import { Layers, Clock, Globe2, Award } from 'lucide-react';
import {
  BLUEPRINT_BEFORE_AFTER,
  SPACECRAFT_TIME_MACHINE,
  MISSION_PATCH_COLLECTION,
} from '../data/phase2HistoryData';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem } from '../types/equipment';
import { ZoomableNasaImage } from './ZoomableNasaImage';

interface BlueprintAndTimeMachineProps {
  onOpenMachine?: (item: EquipmentItem) => void;
}

const PLANET_PERSPECTIVES = [
  {
    world: 'Earth (Baseline)',
    temp: '-89 °C to +56 °C',
    pressure: '1,013 mbar (Breathable N2/O2)',
    gravity: '9.81 m/s² (1.0 g)',
    sky: 'Blue Rayleigh scattering sky',
    challenge: 'Human bodies & laptops thrive naturally; thick air protects from cosmic radiation.',
  },
  {
    world: 'The Moon (Apollo 15 LRV-1)',
    temp: '-173 °C Night to +127 °C Day',
    pressure: '0 mbar (Hard Vacuum)',
    gravity: '1.62 m/s² (0.165 g — 1/6 Earth)',
    sky: 'Pitch-black airless sky even at noon',
    challenge: 'No wind to carry heat away; abrasive electrostatic glass dust wears down seals.',
  },
  {
    world: 'Mars (Opportunity & InSight)',
    temp: '-140 °C Winter Night to +20 °C Summer',
    pressure: '6 mbar (~0.6% Earth, mostly CO2)',
    gravity: '3.72 m/s² (0.38 g)',
    sky: 'Butterscotch / dusty rust sky; blue sunsets',
    challenge: 'Dust blankets solar arrays while thin air makes parachute & helicopter lift 100× harder.',
  },
  {
    world: 'Interstellar Space (Voyager 1)',
    temp: '~3 Kelvin Background (Plasma ~7,000 K thin gas)',
    pressure: 'Near-zero (~0.1 atoms/cm³)',
    gravity: 'Negligible microgravity',
    sky: 'Unfiltered deep-star cosmic void',
    challenge: 'Plutonium RTG heat keeps electronics from freezing as sunlight dwindles to a bright star.',
  },
];

export function BlueprintAndTimeMachine({ onOpenMachine }: BlueprintAndTimeMachineProps) {
  const [baIdx, setBaIdx] = useState(0);
  const [sliderPct, setSliderPct] = useState(50);
  const [eraIdx, setEraIdx] = useState(1);

  const ba = BLUEPRINT_BEFORE_AFTER[baIdx];
  const era = SPACECRAFT_TIME_MACHINE[eraIdx];

  return (
    <div className="space-y-12">
      {/* 1. Behind the Blueprint + Before & After Comparison */}
      <section className="space-y-5">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Layers className="w-4 h-4" />
            <span>Behind the Blueprint &amp; Before / After Archive</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Pre-Launch Cleanroom Design vs Decades in Space
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {BLUEPRINT_BEFORE_AFTER.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setBaIdx(idx)}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold cursor-pointer ${
                idx === baIdx
                  ? 'bg-sky-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              {item.machine}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Split Comparison Card */}
          <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400">BEFORE: Blueprint / Cleanroom</span>
              <span className="text-amber-400">AFTER: Surface / Legacy Reality</span>
            </div>

            <div className="relative rounded-lg border border-slate-800 overflow-hidden bg-[#05070C] min-h-[260px]">
              {/* After layer (base) */}
              <div className="p-6 bg-gradient-to-br from-[#19110E] via-[#0F0B0A] to-[#06080E] min-h-[260px] flex flex-col justify-between">
                <div className="ml-auto max-w-[55%] text-right space-y-2">
                  <div className="font-mono text-[11px] text-amber-400 uppercase">
                    After Mission Exposure
                  </div>
                  <h4 className="text-base font-bold text-white">{ba.afterTitle}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{ba.afterCaption}</p>
                </div>
                <div className="text-[11px] font-mono text-slate-400 text-right">
                  {ba.realityNotes}
                </div>
              </div>

              {/* Before layer (clipped by slider) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#0A182E] via-[#0B1222] to-[#07090E] border-r-2 border-amber-400 p-6 flex flex-col justify-between overflow-hidden"
                style={{ width: `${sliderPct}%` }}
              >
                <div className="max-w-xs space-y-2">
                  <div className="font-mono text-[11px] text-sky-400 uppercase">
                    Before Launch Specification
                  </div>
                  <h4 className="text-base font-bold text-white">{ba.beforeTitle}</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{ba.beforeCaption}</p>
                  <ul className="space-y-1 text-[11px] font-mono text-sky-300 pt-1">
                    {ba.blueprintSpecs.map((sp) => (
                      <li key={sp}>· {sp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Drag Split Comparison</span>
                <span className="tabular-nums">{sliderPct}% Blueprint / {100 - sliderPct}% Reality</span>
              </div>
              <input
                type="range"
                min={15}
                max={85}
                value={sliderPct}
                onChange={(e) => setSliderPct(Number(e.target.value))}
                aria-label="Before and after blueprint comparison slider"
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F18] overflow-hidden">
            <ZoomableNasaImage
              src={ba.imageUrl}
              fallbackSrc={ba.imageUrl}
              alt={ba.machine}
              caption={`${ba.machine} — ${ba.mission}`}
              credit="NASA Official Archive"
              nasaId={ba.nasaId}
              aspectClassName="aspect-[4/3] w-full"
            />
            <div className="p-4 text-xs text-slate-300 space-y-1.5">
              <div className="font-mono text-sky-400">NASA Image ID: {ba.nasaId}</div>
              <p className="leading-relaxed">{ba.realityNotes}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Spacecraft Time Machine (1960s -> 2020s) */}
      <section className="space-y-5 border-t border-slate-800 pt-10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <Clock className="w-4 h-4" />
            <span>Spacecraft Time Machine · 60 Years of Aerospace Evolution</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            How Computers, Cameras &amp; Power Evolved From 1960s to Today
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPACECRAFT_TIME_MACHINE.map((t, idx) => (
            <button
              key={t.decade}
              type="button"
              onClick={() => setEraIdx(idx)}
              className={`rounded-md px-4 py-2 font-mono text-xs font-bold cursor-pointer ${
                idx === eraIdx
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              {t.decade}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="text-xl font-bold text-white">
              {era.decade}: {era.headline}
            </h3>
            <span className="font-mono text-xs text-amber-400">Flagship: {era.flagship}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1">
              <div className="font-mono text-sky-400">Flight Computing</div>
              <p className="text-slate-200 leading-relaxed">{era.computing}</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1">
              <div className="font-mono text-sky-400">Imaging &amp; Sensors</div>
              <p className="text-slate-200 leading-relaxed">{era.cameras}</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1">
              <div className="font-mono text-sky-400">Power Systems</div>
              <p className="text-slate-200 leading-relaxed">{era.power}</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1">
              <div className="font-mono text-amber-400">Communications Link</div>
              <p className="text-slate-200 leading-relaxed">{era.commsRate}</p>
            </div>
            <div className="md:col-span-2 rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1">
              <div className="font-mono text-amber-400">Mobility &amp; Autonomy</div>
              <p className="text-slate-200 leading-relaxed">{era.mobility}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Earth vs Spacecraft Environment Perspective */}
      <section className="space-y-5 border-t border-slate-800 pt-10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Globe2 className="w-4 h-4" />
            <span>Earth vs Spacecraft Perspective · Environmental Extremes</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Compare Human Comfort on Earth Against Off-World Conditions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANET_PERSPECTIVES.map((p) => (
            <article
              key={p.world}
              className="rounded-xl border border-slate-800 bg-[#0B0F18] p-4 space-y-3 text-xs"
            >
              <h3 className="text-sm font-bold text-white">{p.world}</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-slate-400">Temperature</dt>
                  <dd className="font-mono text-amber-300 mt-0.5">{p.temp}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Atmosphere</dt>
                  <dd className="text-slate-200 mt-0.5">{p.pressure}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Surface Gravity</dt>
                  <dd className="font-mono text-sky-300 mt-0.5">{p.gravity}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Sky Appearance</dt>
                  <dd className="text-slate-200 mt-0.5">{p.sky}</dd>
                </div>
              </dl>
              <p className="border-t border-slate-800 pt-2 text-slate-400 leading-relaxed">
                {p.challenge}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Mission Patch Collection */}
      <section className="space-y-5 border-t border-slate-800 pt-10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <Award className="w-4 h-4" />
            <span>Mission Patch Collection · Official Emblem Symbolism</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Stories Woven Into Historic Mission Insignias
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MISSION_PATCH_COLLECTION.map((patch) => {
            const linked = EQUIPMENT_DATA.find((e) => e.id === patch.relatedMachineId);
            return (
              <article
                key={patch.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Stylized Geometric Mission Crest (No Cartoon/Preschool Graphics) */}
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0">
                      <polygon
                        points="32,4 58,18 58,46 32,60 6,46 6,18"
                        fill={patch.badgeColors[0]}
                        stroke={patch.badgeColors[1]}
                        strokeWidth="3"
                      />
                      <circle cx="32" cy="32" r="14" fill="none" stroke={patch.badgeColors[2]} strokeWidth="1.5" />
                      <path d="M18 38 Q32 18 46 30" fill="none" stroke={patch.badgeColors[1]} strokeWidth="2.5" />
                      <circle cx="44" cy="24" r="3" fill={patch.badgeColors[2]} />
                    </svg>
                    <div>
                      <div className="font-mono text-[11px] text-amber-400">
                        {patch.agency} · {patch.year}
                      </div>
                      <h3 className="text-base font-bold text-white">{patch.mission}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{patch.symbolism}</p>
                </div>

                {linked && onOpenMachine && (
                  <button
                    type="button"
                    onClick={() => onOpenMachine(linked)}
                    className="text-left text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer pt-2 border-t border-slate-800"
                  >
                    Inspect {linked.name.split(' (')[0]} →
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
