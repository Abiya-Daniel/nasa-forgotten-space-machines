import { useState } from 'react';
import { Disc3, Volume2, Radio } from 'lucide-react';
import { MESSAGES_BEYOND_EARTH_ITEMS } from '../data/phase2HistoryData';
import { useExperience } from '../context/ExperienceContext';

export function MessagesBeyondEarth() {
  const [selectedId, setSelectedId] = useState(MESSAGES_BEYOND_EARTH_ITEMS[0].id);
  const { unlockBadge, playEffect, startCustomNarration } = useExperience();

  const active =
    MESSAGES_BEYOND_EARTH_ITEMS.find((i) => i.id === selectedId) ||
    MESSAGES_BEYOND_EARTH_ITEMS[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    unlockBadge('badge-deep-space');
  };

  const playGoldenTone = () => {
    playEffect('radio-telemetry');
    unlockBadge('badge-deep-space');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Disc3 className="w-4 h-4" />
            <span>Messages Beyond Earth · Golden Record, Pioneer Plaque &amp; Apollo Disc</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Decoding Humanity&apos;s Interstellar Time Capsules
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Explore how Carl Sagan, Frank Drake, and NASA engineers encoded Earth&apos;s location, mathematics, music, and greetings without relying on any single human language.
          </p>
        </div>

        <button
          type="button"
          onClick={playGoldenTone}
          className="inline-flex items-center gap-2 rounded-md border border-amber-500/50 bg-[#14110B] px-4 py-2 text-xs font-semibold text-amber-300 hover:border-amber-400 cursor-pointer"
        >
          <Radio className="w-4 h-4" />
          <span>Play Synthesized Pulsar / Carrier Demo Tone</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Golden Record & Pulsar SVG Cover Diagram */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#080B13] p-5 space-y-4">
          <div className="font-mono text-xs text-amber-400">
            Voyager Golden Record Cover Diagram (Interactive Schematic)
          </div>

          <svg viewBox="0 0 360 360" className="w-full max-w-[320px] mx-auto block">
            <circle cx="180" cy="180" r="165" fill="#1C1406" stroke="#E8A95B" strokeWidth="3" />
            <circle cx="180" cy="180" r="154" fill="none" stroke="#B47B2B" strokeWidth="1" />

            {/* Top-Left: Phonograph Cartridge & Speed Binary */}
            <g
              className="cursor-pointer"
              onClick={() => handleSelect('msg-greetings')}
            >
              <circle
                cx="105"
                cy="105"
                r="46"
                fill={active.id === 'msg-greetings' ? 'rgba(232,169,91,0.22)' : 'none'}
                stroke="#E8A95B"
                strokeWidth="2"
              />
              <circle cx="105" cy="105" r="8" fill="#E8A95B" />
              <line x1="105" y1="66" x2="142" y2="105" stroke="#FDE68A" strokeWidth="2" />
              <text x="105" y="164" textAnchor="middle" fontSize="9" fill="#FDE68A">
                55 Greetings &amp; Music
              </text>
            </g>

            {/* Bottom-Left: 14-Pulsar Galactic Map */}
            <g
              className="cursor-pointer"
              onClick={() => handleSelect('msg-pulsar-map')}
            >
              <circle
                cx="105"
                cy="245"
                r="52"
                fill={active.id === 'msg-pulsar-map' ? 'rgba(56,189,248,0.18)' : 'transparent'}
              />
              {[0, 28, 52, 78, 108, 134, 162, 195, 224, 250, 282, 310, 336].map((deg, idx) => {
                const rad = (deg * Math.PI) / 180;
                const len = 28 + (idx % 4) * 9;
                return (
                  <line
                    key={deg}
                    x1="105"
                    y1="245"
                    x2={105 + Math.cos(rad) * len}
                    y2={245 + Math.sin(rad) * len}
                    stroke="#FDE68A"
                    strokeWidth="1.5"
                  />
                );
              })}
              <circle cx="105" cy="245" r="3" fill="#38BDF8" />
              <text x="105" y="310" textAnchor="middle" fontSize="9" fill="#FDE68A">
                14-Pulsar Earth Map
              </text>
            </g>

            {/* Bottom-Right: Hydrogen Hyperfine Clock */}
            <g
              className="cursor-pointer"
              onClick={() => handleSelect('msg-hydrogen')}
            >
              <circle
                cx="255"
                cy="250"
                r="45"
                fill={active.id === 'msg-hydrogen' ? 'rgba(56,189,248,0.18)' : 'transparent'}
              />
              <circle cx="232" cy="250" r="14" fill="none" stroke="#E8A95B" strokeWidth="2" />
              <circle cx="278" cy="250" r="14" fill="none" stroke="#E8A95B" strokeWidth="2" />
              <line x1="246" y1="250" x2="264" y2="250" stroke="#E8A95B" strokeWidth="2" />
              <circle cx="232" cy="236" r="2.5" fill="#38BDF8" />
              <circle cx="278" cy="264" r="2.5" fill="#38BDF8" />
              <text x="255" y="310" textAnchor="middle" fontSize="9" fill="#FDE68A">
                Hydrogen 21cm Clock
              </text>
            </g>

            {/* Top-Right: Waveform / Apollo Plaque reference */}
            <g
              className="cursor-pointer"
              onClick={() => handleSelect('msg-apollo-disc')}
            >
              <rect
                x="208"
                y="68"
                width="92"
                height="62"
                rx="6"
                fill={active.id === 'msg-apollo-disc' ? 'rgba(232,169,91,0.2)' : 'none'}
                stroke="#E8A95B"
                strokeWidth="1.8"
              />
              <path
                d="M218 105 L234 105 L238 82 L246 118 L254 88 L262 110 L270 105 L290 105"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="1.6"
              />
              <text x="254" y="146" textAnchor="middle" fontSize="9" fill="#FDE68A">
                Plaques &amp; Signal Key
              </text>
            </g>
          </svg>
          <p className="text-center text-[11px] text-slate-400">
            Click any quadrant of the Golden Record diagram to decode its physics.
          </p>
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {MESSAGES_BEYOND_EARTH_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`rounded-lg border p-3.5 text-left cursor-pointer transition-colors ${
                  active.id === item.id
                    ? 'border-amber-400 bg-[#121A2C] text-white'
                    : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[10px] text-sky-400 uppercase">{item.category}</div>
                <div className="mt-1 text-xs sm:text-sm font-bold leading-snug">{item.title}</div>
              </button>
            ))}
          </div>

          <article className="rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="font-mono text-xs text-sky-400">{active.category}</div>
                <h3 className="mt-1 text-xl font-bold text-white">{active.title}</h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  startCustomNarration(
                    active.id,
                    'Messages Beyond Earth',
                    active.title,
                    `${active.symbolDescription} ${active.meaning} ${active.scientificInsight}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs text-sky-300 hover:border-sky-400 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Narrate</span>
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
              <p>
                <strong className="text-amber-300">Engraved Symbol:</strong> {active.symbolDescription}
              </p>
              <p>
                <strong className="text-sky-300">Decoded Meaning:</strong> {active.meaning}
              </p>
              <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5 text-xs text-slate-300">
                <strong className="text-emerald-400 font-mono">Scientific Insight:</strong>{' '}
                {active.scientificInsight}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
