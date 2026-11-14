import { useState } from 'react';
import { Sparkles, Volume2, Pause, Play, BookOpen, Info } from 'lucide-react';
import { FEATURED_DOSSIERS } from '../data/featuredDossiers';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { FeaturedMachineId } from '../types/equipment';
import { useExperience } from '../context/ExperienceContext';
import { NasaImage } from './NasaImage';

interface ExtraReflection {
  id: string;
  equipmentId: string;
  title: string;
  subtitle: string;
  disclaimer: string;
  passage: string;
  groundedFacts: string[];
}

const EXTRA_REFLECTIONS: ExtraReflection[] = [
  {
    id: 'reflection-cassini',
    equipmentId: 'cassini-huygens',
    title: 'Cassini Orbiter — Final Descent Into Saturn',
    subtitle: 'Saturn System (1997–2017) · Creative Reflection',
    disclaimer:
      'Creative First-Person Interpretation Based on Documented Facts (Not a Real NASA Transmission).',
    passage:
      'For thirteen years I danced between golden rings and icy moons—tasting saltwater spray from Enceladus and dropping Huygens onto misty Titan. When my propellant grew scarce, my builders chose a noble ending: to protect those ocean worlds forever, I aimed my dish toward Earth one last time and fired every thruster until Saturn’s upper wind claimed me.',
    groundedFacts: [
      '294 orbits around Saturn across 13 years',
      '22 Grand Finale dives inside the D-ring gap',
      'Last Earth-received telemetry: September 15, 2017',
    ],
  },
  {
    id: 'reflection-spirit',
    equipmentId: 'spirit-mer-a',
    title: 'Spirit Rover — Stationary Science at Troy',
    subtitle: 'Gusev Crater, Mars (2004–2010) · Creative Reflection',
    disclaimer:
      'Creative First-Person Interpretation Based on Documented Facts (Not a Real NASA Transmission).',
    passage:
      'One stalled wheel held me fast in bright sulfate sand beside Home Plate, yet turning my wheel in place scraped open ancient silica—proof of warm Martian hot springs long ago. Even when I could no longer climb a sun-facing hill for winter, I spent every remaining watt listening to the sky and measuring the spin of Mars.',
    groundedFacts: [
      '7.73 km traversed in Gusev Crater across 2,210 sols',
      'Uncovered ~90% pure amorphous silica near Home Plate',
      'Final confirmed communication: March 22, 2010',
    ],
  },
];

const FEATURED_KEYS: FeaturedMachineId[] = [
  'apollo-15-lrv1',
  'opportunity-mer-b',
  'insight-lander',
  'voyager-1',
];

interface IfMachineCouldSpeakProps {
  onOpenFeaturedDossier?: (id: FeaturedMachineId) => void;
}

export function IfMachineCouldSpeak({ onOpenFeaturedDossier }: IfMachineCouldSpeakProps) {
  const [selectedId, setSelectedId] = useState<string>('apollo-15-lrv1');

  const {
    activeTrack,
    isPlaying,
    isPaused,
    startCustomNarration,
    togglePlayPause,
  } = useExperience();

  const isFeatured = (FEATURED_KEYS as string[]).includes(selectedId);
  const featuredDossier = isFeatured
    ? FEATURED_DOSSIERS[selectedId as FeaturedMachineId]
    : null;
  const extraReflection = !isFeatured
    ? EXTRA_REFLECTIONS.find((r) => r.id === selectedId) || EXTRA_REFLECTIONS[0]
    : null;

  const equipmentId = featuredDossier
    ? featuredDossier.equipmentId
    : extraReflection!.equipmentId;
  const equipment = EQUIPMENT_DATA.find((e) => e.id === equipmentId);

  const trackId = `speak-${selectedId}`;
  const isCurrentSpeaking = activeTrack?.id === trackId && isPlaying && !isPaused;
  const isCurrentPaused = activeTrack?.id === trackId && isPaused;

  const title = featuredDossier
    ? featuredDossier.creativeStorytellingTitle
    : extraReflection!.title;
  const disclaimer = featuredDossier
    ? featuredDossier.creativeStorytellingDisclaimer
    : extraReflection!.disclaimer;
  const passage = featuredDossier
    ? featuredDossier.creativeStorytellingPassage
    : extraReflection!.passage;
  const facts = featuredDossier
    ? featuredDossier.specs.slice(0, 3).map((s) => `${s.label}: ${s.value}`)
    : extraReflection!.groundedFacts;

  const handleListen = () => {
    if (activeTrack?.id === trackId) {
      togglePlayPause();
    } else {
      startCustomNarration(
        trackId,
        `${equipment?.name || 'Spacecraft'} — First-Person Reflection`,
        title,
        passage
      );
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Sparkles className="w-4 h-4" />
          <span>Imaginative Museum Storytelling Mode · Fact-Grounded Literature</span>
        </div>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-100">
          If This Machine Could Speak
        </h2>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-3xl">
          Read or listen to creative first-person reflections written from the
          engineering history of each spacecraft. Every passage is explicitly labeled as
          imaginative storytelling—never presented as a literal radio transmission.
        </p>
      </div>

      {/* Spacecraft Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {FEATURED_KEYS.map((id) => {
          const item = EQUIPMENT_DATA.find((e) => e.id === FEATURED_DOSSIERS[id].equipmentId);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedId(id)}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                selectedId === id
                  ? 'bg-sky-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              {item?.name.split(' (')[0] || id}
            </button>
          );
        })}
        {EXTRA_REFLECTIONS.map((ref) => (
          <button
            key={ref.id}
            type="button"
            onClick={() => setSelectedId(ref.id)}
            className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              selectedId === ref.id
                ? 'bg-sky-500 text-slate-950'
                : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
            }`}
          >
            {ref.title.split(' — ')[0]}
          </button>
        ))}
      </div>

      {/* Narrative Reader Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch rounded-lg border border-sky-500/30 bg-[#0A101E] overflow-hidden">
        {equipment && (
          <div className="lg:col-span-5 bg-[#060910] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
            <NasaImage
              src={equipment.photo.imageUrl}
              fallbackSrc={equipment.photo.fallbackUrl}
              alt={equipment.photo.title}
              aspectClassName="aspect-[4/3] w-full"
            />
            <div className="p-4 space-y-2 text-xs border-t border-slate-800/80">
              <div className="font-mono text-sky-400">
                Authentic NASA Photo · ID: {equipment.photo.nasaId}
              </div>
              <p className="text-slate-300">{equipment.photo.title}</p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="font-mono uppercase text-[11px] text-amber-400">
                  Documented Facts Underlying Passage
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  {facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-start gap-2 rounded-md border border-amber-500/40 bg-[#141724] px-3.5 py-2.5 text-xs text-amber-200">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{disclaimer}</span>
            </div>

            <div>
              <div className="font-mono text-xs text-sky-400">
                {equipment?.mission} · First-Person Perspective
              </div>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-100">
                {title}
              </h3>
            </div>

            <blockquote className="text-base sm:text-lg leading-relaxed text-slate-100 italic font-normal border-t border-b border-slate-800 py-5">
              &ldquo;{passage}&rdquo;
            </blockquote>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleListen}
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors cursor-pointer"
            >
              {isCurrentSpeaking ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Narration</span>
                </>
              ) : isCurrentPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume Narration</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen via Text-to-Speech</span>
                </>
              )}
            </button>

            {isFeatured && onOpenFeaturedDossier && (
              <button
                type="button"
                onClick={() => onOpenFeaturedDossier(selectedId as FeaturedMachineId)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-4 py-2.5 text-xs font-semibold text-amber-300 hover:border-amber-400 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read 12-Chapter Documentary</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
