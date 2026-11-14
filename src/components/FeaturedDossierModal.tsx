import { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Square,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  MapPin,
  Compass,
  ExternalLink,
  BookOpen,
  Sparkles,
  FileText,
  Heart,
} from 'lucide-react';
import { FEATURED_DOSSIERS } from '../data/featuredDossiers';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem, FeaturedMachineId } from '../types/equipment';
import { useExperience } from '../context/ExperienceContext';
import { StatusIndicator } from './StatusIndicator';
import { ZoomableNasaImage } from './ZoomableNasaImage';
import { MachineAnatomyDiagram } from './MachineAnatomyDiagram';
import { formatCoord } from './EquipmentDetailModal';
import { AskThisMachinePanel } from './AskThisMachinePanel';

interface FeaturedDossierModalProps {
  machineId: FeaturedMachineId | null;
  onClose: () => void;
  onLocateOnMap: (item: EquipmentItem) => void;
}

export function FeaturedDossierModal({
  machineId,
  onClose,
  onLocateOnMap,
}: FeaturedDossierModalProps) {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  const {
    activeTrack,
    chapterIndex: narratingIdx,
    isPlaying,
    isPaused,
    progressPct,
    readingSpeed,
    startMachineNarration,
    togglePlayPause,
    stopNarration,
    nextChapter,
    prevChapter,
    replayChapter,
    setReadingSpeed,
    favorites,
    toggleFavorite,
    recordExploredMachine,
  } = useExperience();

  useEffect(() => {
    setActiveChapterIdx(0);
    setShowTranscript(false);
    if (machineId && FEATURED_DOSSIERS[machineId]) {
      recordExploredMachine(FEATURED_DOSSIERS[machineId].equipmentId);
    }
  }, [machineId, recordExploredMachine]);

  useEffect(() => {
    if (!machineId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [machineId, onClose]);

  if (!machineId) return null;

  const dossier = FEATURED_DOSSIERS[machineId];
  const item = EQUIPMENT_DATA.find((eq) => eq.id === dossier.equipmentId);
  if (!dossier || !item) return null;

  const isThisMachineTrack = activeTrack?.id === machineId;
  const activeChapter = dossier.chapters[activeChapterIdx] || dossier.chapters[0];

  const handleListenChapter = (idx: number) => {
    setActiveChapterIdx(idx);
    startMachineNarration(machineId, idx);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="featured-dossier-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-slate-800 bg-[#080B13] text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-slate-800 bg-[#080B13]/95 backdrop-blur px-5 sm:px-7 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
              <span className="font-mono text-amber-400 font-semibold">
                Featured Documentary Dossier
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{item.mission}</span>
              <span aria-hidden="true">·</span>
              <StatusIndicator status={item.status} />
            </div>
            <h2
              id="featured-dossier-title"
              className="mt-1 text-xl sm:text-2xl font-bold text-slate-100"
            >
              {item.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{dossier.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleFavorite(item.id)}
              aria-label={favorites.includes(item.id) ? 'Remove from favorites' : 'Save to favorites'}
              aria-pressed={favorites.includes(item.id)}
              className={`rounded-md border p-2 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer transition-colors ${
                favorites.includes(item.id)
                  ? 'border-rose-400/70 bg-rose-950/60 text-rose-300'
                  : 'border-slate-800 bg-[#101624] text-slate-300 hover:text-white'
              }`}
            >
              <Heart
                className="w-4 h-4"
                fill={favorites.includes(item.id) ? 'currentColor' : 'none'}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close featured dossier"
              className="rounded-md border border-slate-800 bg-[#101624] p-2 text-slate-300 hover:text-white hover:border-amber-400 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-8">
          {/* Top Overview Grid: Authentic Photo + Mission Telemetry + Narration Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 rounded-lg overflow-hidden border border-slate-800 bg-[#05070C]">
              <ZoomableNasaImage
                src={dossier.heroPhoto.imageUrl}
                fallbackSrc={dossier.heroPhoto.fallbackUrl}
                alt={dossier.heroPhoto.title}
                caption={dossier.heroPhoto.title}
                credit={dossier.heroPhoto.credit}
                sourceUrl={dossier.heroPhoto.sourceUrl}
                nasaId={dossier.heroPhoto.nasaId}
                aspectClassName="aspect-[4/3] w-full"
              />
              <div className="p-3.5 text-xs text-slate-400 border-t border-slate-800/80 space-y-1">
                <div className="font-mono text-sky-400">
                  Authentic NASA Photograph · ID: {dossier.heroPhoto.nasaId}
                </div>
                <p className="text-slate-200 font-medium">{dossier.heroPhoto.title}</p>
                <p>Credit: {dossier.heroPhoto.credit}</p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
                {dossier.tagline}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                {dossier.statusNote}
              </p>

              {/* Specs Grid */}
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-md border border-slate-800 bg-[#0C121E] p-4 text-xs">
                {dossier.specs.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-slate-400">{spec.label}</dt>
                    <dd className="mt-0.5 font-mono tabular-nums text-slate-100">
                      {spec.value}
                    </dd>
                  </div>
                ))}
                <div className="sm:col-span-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>
                    {item.body === 'deep-space'
                      ? `Trajectory Region: ${item.coordinates.region}`
                      : `Surface Location: ${formatCoord(item)}`}
                  </span>
                  <span className="font-mono text-amber-300">
                    Last Checked: {dossier.lastCheckedDate}
                  </span>
                </div>
              </dl>

              {/* Action Row */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onLocateOnMap(item)}
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  {item.body === 'deep-space' ? (
                    <Compass className="w-4 h-4" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  <span>
                    {item.body === 'deep-space'
                      ? 'View Deep Space Trajectory Route'
                      : 'Locate on Planetary Map'}
                  </span>
                </button>
                <a
                  href={item.nssdcaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0D1320] px-4 py-2.5 text-xs font-medium text-slate-200 hover:border-slate-500"
                >
                  <span>NSSDCA Record ({item.nssdcaId})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Dedicated Story Audio Narration Console */}
          <section
            aria-label="Audio narration player"
            className="rounded-lg border border-slate-800 bg-[#0C121E] p-4 sm:p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                    Documentary Audio Narration · 12 Chapters
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {isThisMachineTrack
                      ? `Now narrating Chapter ${narratingIdx + 1}: ${dossier.chapters[narratingIdx]?.title}`
                      : `Selected Chapter ${activeChapter.index}: ${activeChapter.title}`}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isThisMachineTrack ? (
                  <button
                    type="button"
                    onClick={() => handleListenChapter(activeChapterIdx)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Listen to Chapter {activeChapter.index}</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
                    >
                      {isPlaying && !isPaused ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={prevChapter}
                      disabled={narratingIdx <= 0}
                      aria-label="Previous chapter"
                      className="rounded-md border border-slate-700 px-2.5 py-2 text-xs text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={replayChapter}
                      aria-label="Replay current chapter"
                      className="rounded-md border border-slate-700 px-2.5 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={nextChapter}
                      disabled={narratingIdx >= dossier.chapters.length - 1}
                      aria-label="Next chapter"
                      className="rounded-md border border-slate-700 px-2.5 py-2 text-xs text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={stopNarration}
                      aria-label="Stop narration"
                      className="rounded-md border border-slate-700 px-2.5 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <select
                  aria-label="Reading speed"
                  value={readingSpeed}
                  onChange={(e) => setReadingSpeed(Number(e.target.value))}
                  className="rounded-md border border-slate-700 bg-[#07090E] px-2.5 py-2 text-xs text-slate-200 cursor-pointer"
                >
                  <option value={0.85}>Speed 0.85x</option>
                  <option value={1}>Speed 1.0x</option>
                  <option value={1.25}>Speed 1.25x</option>
                  <option value={1.5}>Speed 1.5x</option>
                </select>

                <button
                  type="button"
                  onClick={() => setShowTranscript((s) => !s)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-3 py-2 text-xs text-sky-300 hover:border-sky-500 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{showTranscript ? 'Hide Transcript' : 'Full Transcript'}</span>
                </button>
              </div>
            </div>

            {isThisMachineTrack && (
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-[width] duration-200"
                  style={{ width: `${Math.round(progressPct)}%` }}
                />
              </div>
            )}

            {showTranscript && (
              <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 text-xs text-slate-300 space-y-2 max-h-48 overflow-y-auto">
                <div className="font-mono text-sky-400">
                  Written Narration Transcript — Chapter {activeChapter.index}: {activeChapter.title}
                </div>
                <p className="leading-relaxed">{activeChapter.body}</p>
                <p className="text-amber-300 font-medium">
                  Key Scientific Fact: {activeChapter.factHighlight}
                </p>
              </div>
            )}
          </section>

          {/* 12-Chapter Documentary Story Reader */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <h3 className="text-lg font-bold text-slate-100">
                Complete 12-Chapter Mission Story
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Chapter List */}
              <div className="lg:col-span-4 space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {dossier.chapters.map((ch, idx) => {
                  const isActive = idx === activeChapterIdx;
                  const isCurrentlyNarrating =
                    isThisMachineTrack && narratingIdx === idx && isPlaying;
                  return (
                    <button
                      key={ch.index}
                      type="button"
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`w-full text-left rounded-md border px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'border-amber-400 bg-[#121A2C] text-white'
                          : 'border-slate-800/90 bg-[#0B0F18] text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-sky-400">
                          Chapter {String(ch.index).padStart(2, '0')}
                        </span>
                        {isCurrentlyNarrating && (
                          <span className="font-mono text-[10px] text-amber-400">
                            Playing
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 font-semibold">{ch.title}</div>
                    </button>
                  );
                })}
              </div>

              {/* Active Chapter Narrative */}
              <article className="lg:col-span-8 rounded-lg border border-slate-800 bg-[#0B0F18] p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="font-mono text-xs text-sky-400">
                        Chapter {activeChapter.index} of {dossier.chapters.length}
                      </div>
                      <h4 className="mt-1 text-xl font-bold text-slate-100">
                        {activeChapter.title}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleListenChapter(activeChapterIdx)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs font-medium text-amber-300 hover:border-amber-400 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Narrate Chapter</span>
                    </button>
                  </div>

                  <p className="text-sm font-medium text-sky-200/90 leading-relaxed">
                    {activeChapter.summary}
                  </p>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                    {activeChapter.body}
                  </p>

                  <div className="rounded-md border border-amber-500/30 bg-[#121622] p-4 text-xs sm:text-sm">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                      Scientific Highlight
                    </div>
                    <p className="mt-1 text-slate-100 leading-relaxed">
                      {activeChapter.factHighlight}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
                  <span>Source: {activeChapter.sourceNote}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={activeChapterIdx <= 0}
                      onClick={() => setActiveChapterIdx((i) => Math.max(0, i - 1))}
                      className="rounded border border-slate-700 px-3 py-1.5 text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
                    >
                      Previous Chapter
                    </button>
                    <button
                      type="button"
                      disabled={activeChapterIdx >= dossier.chapters.length - 1}
                      onClick={() =>
                        setActiveChapterIdx((i) =>
                          Math.min(dossier.chapters.length - 1, i + 1)
                        )
                      }
                      className="rounded bg-slate-100 px-3 py-1.5 font-semibold text-slate-950 hover:bg-white disabled:opacity-40 cursor-pointer"
                    >
                      Next Chapter
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Creative Storytelling Mode (Explicitly Labeled) */}
          <section className="rounded-lg border border-sky-500/30 bg-[#0A101E] p-5 sm:p-6 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
              <Sparkles className="w-4 h-4" />
              <span>{dossier.creativeStorytellingTitle}</span>
            </div>
            <p className="text-[11px] text-amber-300/90 font-medium">
              {dossier.creativeStorytellingDisclaimer}
            </p>
            <blockquote className="text-sm sm:text-base italic leading-relaxed text-slate-200 pt-1">
              &ldquo;{dossier.creativeStorytellingPassage}&rdquo;
            </blockquote>
          </section>

          {/* Ask This Machine & Explain Level */}
          <AskThisMachinePanel item={item} />

          {/* Interactive Machine Anatomy & 3D Engineering Viewer */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-100">
              Interactive Machine Anatomy &amp; 3D Model
            </h3>
            <MachineAnatomyDiagram machineId={machineId} />
          </section>
        </div>
      </div>
    </div>
  );
}
