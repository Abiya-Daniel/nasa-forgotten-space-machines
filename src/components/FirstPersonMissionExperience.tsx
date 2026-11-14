import { useState, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Volume2,
  CheckCircle2,
  Compass,
  Camera,
} from 'lucide-react';
import { FIRST_PERSON_JOURNEYS } from '../data/phase2InteractiveData';
import { useExperience } from '../context/ExperienceContext';
import { NasaImage } from './NasaImage';

export function FirstPersonMissionExperience() {
  const [journeyIdx, setJourneyIdx] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageContainerRef = useRef<HTMLDivElement | null>(null);

  const { startCustomNarration, unlockBadge, recordSimCompletion } = useExperience();

  const journey = FIRST_PERSON_JOURNEYS[journeyIdx];
  const stage = journey.stages[stageIdx] || journey.stages[0];
  const isLastStage = stageIdx === journey.stages.length - 1;
  const progressPct = Math.round(((stageIdx + 1) / journey.stages.length) * 100);

  const selectJourney = (idx: number) => {
    setJourneyIdx(idx);
    setStageIdx(0);
  };

  const handleAdvance = () => {
    if (!isLastStage) {
      setStageIdx((i) => i + 1);
    } else {
      if (!completedIds.includes(journey.id)) {
        setCompletedIds((prev) => [...prev, journey.id]);
      }
      unlockBadge(journey.badgeOnComplete);
      recordSimCompletion(`fp-${journey.id}`);
    }
  };

  const toggleFullscreen = () => {
    if (!stageContainerRef.current) return;
    if (!document.fullscreenElement) {
      stageContainerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Compass className="w-4 h-4" />
            <span>First-Person Mission Experience · Step-by-Step Interactive Journeys</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Step Inside Historic Launches, Landings &amp; Deep-Space Crossings
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Select a mission profile below and step through each phase with historical telemetry overlays, audio narration, and clear distinctions between authentic NASA photos and simulated environments.
          </p>
        </div>
      </div>

      {/* Mission Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {FIRST_PERSON_JOURNEYS.map((j, idx) => {
          const active = idx === journeyIdx;
          const done = completedIds.includes(j.id);
          return (
            <button
              key={j.id}
              type="button"
              onClick={() => selectJourney(idx)}
              className={`rounded-lg border p-3.5 text-left transition-colors cursor-pointer space-y-1.5 ${
                active
                  ? 'border-amber-400 bg-[#121A2C] text-white'
                  : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-sky-400">
                <span>JOURNEY 0{idx + 1}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-xs font-bold leading-snug">{j.machineName}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2">{j.mission}</div>
            </button>
          );
        })}
      </div>

      {/* Immersive Viewport Stage */}
      <div
        ref={stageContainerRef}
        className="rounded-xl border border-slate-800 bg-[#060911] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Top Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-[#0A0E18] px-5 py-3">
          <div className="space-y-0.5">
            <div className="font-mono text-xs text-amber-400">
              {journey.title}
            </div>
            <div className="text-xs text-slate-400">{stage.telemetryNote}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                startCustomNarration(
                  `fp-${journey.id}-${stage.stageNum}`,
                  journey.machineName,
                  stage.title,
                  `${stage.title}. ${stage.altitudeOrDist}. ${stage.narrative}`
                )
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs font-medium text-sky-300 hover:border-sky-400 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Narrate Stage</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stage Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 relative bg-[#030509] min-h-[300px] sm:min-h-[380px]">
            <NasaImage
              src={stage.photoUrl}
              fallbackSrc={stage.photoUrl}
              alt={stage.title}
              aspectClassName="h-full w-full min-h-[300px] sm:min-h-[380px]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-[#060911]/40"
              aria-hidden="true"
            />

            {/* Explicit Visual Source Label */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[11px] font-semibold border ${
                  stage.visualType === 'Historical NASA Photo'
                    ? 'border-sky-500/50 bg-[#070D19]/90 text-sky-300'
                    : 'border-amber-500/50 bg-[#141008]/90 text-amber-300'
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>{stage.visualType}</span>
              </span>
              {stage.nasaId && (
                <span className="rounded bg-black/80 px-2 py-1 font-mono text-[11px] text-slate-300">
                  ID: {stage.nasaId}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="rounded bg-black/80 px-2.5 py-1 font-mono tabular-nums text-amber-300">
                Range / Altitude: {stage.altitudeOrDist}
              </span>
              <span className="rounded bg-black/80 px-2.5 py-1 text-[11px] text-slate-300">
                Credit: {stage.credit}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-6 bg-[#0B0F18]">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-400">
                    Stage {stage.stageNum} of {journey.stages.length}
                  </span>
                  <span className="text-slate-400 tabular-nums">{progressPct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-[width] duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-100 leading-snug">
                {stage.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {stage.narrative}
              </p>

              {/* Stage Quick Step Dots */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {journey.stages.map((s, idx) => (
                  <button
                    key={s.stageNum}
                    type="button"
                    onClick={() => setStageIdx(idx)}
                    className={`rounded px-2.5 py-1 font-mono text-[11px] cursor-pointer transition-colors ${
                      idx === stageIdx
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : idx < stageIdx
                          ? 'bg-slate-800 text-emerald-300'
                          : 'border border-slate-800 bg-[#07090E] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    0{s.stageNum}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                disabled={stageIdx === 0}
                onClick={() => setStageIdx((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleAdvance}
                className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isLastStage && completedIds.includes(journey.id)
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
              >
                <span>
                  {isLastStage && completedIds.includes(journey.id)
                    ? 'Journey Completed (Badge Unlocked)'
                    : stage.actionPrompt}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
