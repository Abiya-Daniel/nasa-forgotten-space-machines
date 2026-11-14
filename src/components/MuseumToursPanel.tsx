import { useState } from 'react';
import { Map, ChevronRight, ChevronLeft, Volume2, BookOpen, CheckCircle2 } from 'lucide-react';
import { GUIDED_MUSEUM_TOURS } from '../data/phase2InteractiveData';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem } from '../types/equipment';
import { useExperience } from '../context/ExperienceContext';
import { NasaImage } from './NasaImage';

interface MuseumToursPanelProps {
  onOpenMachine?: (item: EquipmentItem) => void;
}

export function MuseumToursPanel({ onOpenMachine }: MuseumToursPanelProps) {
  const [tourIdx, setTourIdx] = useState(0);
  const [stopIdx, setStopIdx] = useState(0);

  const {
    completedTours,
    recordTourCompletion,
    unlockBadge,
    startCustomNarration,
  } = useExperience();

  const tour = GUIDED_MUSEUM_TOURS[tourIdx] || GUIDED_MUSEUM_TOURS[0];
  const stop = tour.stops[stopIdx] || tour.stops[0];
  const machine = EQUIPMENT_DATA.find((e) => e.id === stop.equipmentId);
  const isLastStop = stopIdx === tour.stops.length - 1;
  const isCompleted = completedTours.includes(tour.id);

  const selectTour = (idx: number) => {
    setTourIdx(idx);
    setStopIdx(0);
  };

  const handleNextStop = () => {
    if (!isLastStop) {
      setStopIdx((s) => s + 1);
    } else {
      recordTourCompletion(tour.id);
      unlockBadge(tour.badgeId);
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Map className="w-4 h-4" />
          <span>Interactive Space Museum Tours · 5 Curated Journeys</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Guided Curatorial Tours Across the Museum
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Follow a step-by-step guided exhibition with curator commentary, audio narration, and direct links to each spacecraft&apos;s full dossier. Finishing a tour unlocks its thematic Explorer Badge.
        </p>
      </div>

      {/* Tour selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {GUIDED_MUSEUM_TOURS.map((t, idx) => {
          const done = completedTours.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTour(idx)}
              className={`text-left rounded-lg border p-3.5 text-xs transition-colors cursor-pointer space-y-1.5 ${
                idx === tourIdx
                  ? 'border-amber-400 bg-[#121A2C] text-white'
                  : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                <span className="text-sky-400">{t.durationLabel}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="font-bold leading-snug">{t.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Stop Exhibit */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="font-mono text-xs text-amber-400">
              {tour.title} · Stop {stopIdx + 1} of {tour.stops.length}
            </div>
            <h3 className="mt-1 text-xl font-bold text-white">{stop.stopTitle}</h3>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-mono text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tour Completed
              </span>
            )}
            <button
              type="button"
              onClick={() =>
                startCustomNarration(
                  `tour-${tour.id}-${stopIdx}`,
                  tour.title,
                  stop.stopTitle,
                  `${stop.curatorNote} ${machine ? machine.scientificValue : ''}`
                )
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs font-medium text-sky-300 hover:border-sky-400 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Narrate Stop</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {machine && (
            <div className="lg:col-span-5 rounded-lg overflow-hidden border border-slate-800 bg-[#07090E]">
              <NasaImage
                src={machine.photo.imageUrl}
                fallbackSrc={machine.photo.fallbackUrl}
                alt={machine.photo.title}
                aspectClassName="aspect-[4/3] w-full"
              />
              <div className="p-3 text-[11px] text-slate-400 border-t border-slate-800">
                Authentic NASA Photo · ID: {machine.photo.nasaId} · {machine.photo.credit}
              </div>
            </div>
          )}

          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-lg border border-amber-500/30 bg-[#121622] p-4 space-y-1.5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                Curator Exhibition Commentary
              </div>
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
                {stop.curatorNote}
              </p>
            </div>

            {machine && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <p>
                  <strong className="text-white">Mission Purpose:</strong>{' '}
                  {machine.missionPurpose}
                </p>
                <p>
                  <strong className="text-white">Scientific Value:</strong>{' '}
                  {machine.scientificValue}
                </p>
                {onOpenMachine && (
                  <button
                    type="button"
                    onClick={() => onOpenMachine(machine)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3.5 py-2 text-xs font-semibold text-sky-300 hover:border-sky-400 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Full {machine.name} Dossier</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stop Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-1.5">
            {tour.stops.map((s, idx) => (
              <button
                key={s.equipmentId}
                type="button"
                onClick={() => setStopIdx(idx)}
                aria-label={`Jump to stop ${idx + 1}`}
                className={`h-2.5 w-8 rounded-full transition-colors cursor-pointer ${
                  idx === stopIdx
                    ? 'bg-amber-400'
                    : idx < stopIdx
                      ? 'bg-sky-500'
                      : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={stopIdx === 0}
              onClick={() => setStopIdx((s) => Math.max(0, s - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Stop</span>
            </button>
            <button
              type="button"
              onClick={handleNextStop}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
            >
              <span>
                {isLastStop ? 'Complete Tour & Claim Badge' : 'Next Tour Stop'}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
