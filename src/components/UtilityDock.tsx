import { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  FileText,
} from 'lucide-react';
import { useExperience, TextSizeOption } from '../context/ExperienceContext';

export function UtilityDock() {
  const {
    activeTrack,
    chapterIndex,
    isPlaying,
    isPaused,
    progressPct,
    narrationVolume,
    readingSpeed,
    togglePlayPause,
    stopNarration,
    nextChapter,
    replayChapter,
    setNarrationVolume,
    setReadingSpeed,
    ambienceEnabled,
    ambienceVolume,
    toggleAmbience,
    setAmbienceVolume,
    textSize,
    setTextSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    captionsAlwaysOn,
    setCaptionsAlwaysOn,
    transcriptOpen,
    setTranscriptOpen,
  } = useExperience();

  const [open, setOpen] = useState(false);

  const currentChapter = activeTrack?.chapters[chapterIndex] || null;

  return (
    <div className="no-print fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 max-w-[92vw]">
      {/* Written Transcript Popover when toggled */}
      {transcriptOpen && currentChapter && (
        <div className="w-80 sm:w-96 rounded-lg border border-slate-700 bg-[#090D16] p-4 shadow-2xl text-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-amber-400">Narration Transcript</span>
            <button
              type="button"
              onClick={() => setTranscriptOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="font-semibold text-slate-100">{currentChapter.title}</div>
          <p className="text-slate-300 leading-relaxed max-h-44 overflow-y-auto pr-1">
            {currentChapter.text}
          </p>
        </div>
      )}

      {/* Expanded Audio & Accessibility Controls Drawer */}
      {open && (
        <div className="w-80 sm:w-96 rounded-lg border border-slate-700 bg-[#090D16] p-4 shadow-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-100">
              Audio &amp; Accessibility Studio
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Collapse audio and accessibility panel"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Minimize</span>
            </button>
          </div>

          {/* Story Narration Controls */}
          <div className="space-y-2 rounded-md border border-slate-800 bg-[#06080E] p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sky-400">Story Narration</span>
              {currentChapter && (
                <button
                  type="button"
                  onClick={() => setTranscriptOpen(!transcriptOpen)}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>{transcriptOpen ? 'Hide Transcript' : 'Transcript'}</span>
                </button>
              )}
            </div>

            <div className="text-slate-200 font-medium truncate">
              {activeTrack ? activeTrack.label : 'Challenge Introduction'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentChapter ? currentChapter.title : 'Ready to narrate'}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-[width] duration-200"
                style={{ width: `${Math.round(progressPct)}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex items-center gap-1 rounded bg-amber-500 px-2.5 py-1.5 font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={stopNarration}
                aria-label="Stop narration"
                className="rounded border border-slate-700 px-2 py-1.5 text-slate-200 hover:border-slate-500 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={replayChapter}
                aria-label="Replay chapter"
                disabled={!activeTrack}
                className="rounded border border-slate-700 px-2 py-1.5 text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextChapter}
                aria-label="Skip to next chapter"
                disabled={!activeTrack || chapterIndex >= activeTrack.chapters.length - 1}
                className="rounded border border-slate-700 px-2 py-1.5 text-slate-200 hover:border-slate-500 disabled:opacity-40 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <select
                aria-label="Narration reading speed"
                value={readingSpeed}
                onChange={(e) => setReadingSpeed(Number(e.target.value))}
                className="ml-auto rounded border border-slate-700 bg-[#0B0F18] px-1.5 py-1 text-[11px] text-slate-200 cursor-pointer"
              >
                <option value={0.85}>0.85x</option>
                <option value={1}>1.0x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
            </div>

            <label className="flex items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
              <span>Narration Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={narrationVolume}
                onChange={(e) => setNarrationVolume(Number(e.target.value))}
                className="w-32 accent-amber-400 cursor-pointer"
              />
            </label>
          </div>

          {/* Space Ambience Controls */}
          <div className="space-y-2 rounded-md border border-slate-800 bg-[#06080E] p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-200">
                Gentle Space Ambience (Synthesized)
              </span>
              <button
                type="button"
                onClick={toggleAmbience}
                className={`rounded px-2.5 py-1 font-semibold cursor-pointer ${
                  ambienceEnabled
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-700 text-slate-300'
                }`}
              >
                {ambienceEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <label className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>Ambience Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={ambienceVolume}
                onChange={(e) => setAmbienceVolume(Number(e.target.value))}
                className="w-32 accent-sky-400 cursor-pointer"
              />
            </label>
          </div>

          {/* Accessibility Controls */}
          <div className="space-y-2.5 rounded-md border border-slate-800 bg-[#06080E] p-3">
            <div className="font-mono text-slate-300">Accessibility Settings</div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Text Size</span>
              <div className="inline-flex rounded border border-slate-700 bg-[#0B0F18] p-0.5">
                {(['normal', 'large', 'xlarge'] as TextSizeOption[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setTextSize(sz)}
                    className={`rounded px-2 py-0.5 text-[11px] cursor-pointer ${
                      textSize === sz
                        ? 'bg-slate-100 text-slate-950 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    {sz === 'normal' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Reduced Motion</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="accent-amber-400"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">High Contrast Borders</span>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="accent-amber-400"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-300">Always Show Captions</span>
              <input
                type="checkbox"
                checked={captionsAlwaysOn}
                onChange={(e) => setCaptionsAlwaysOn(e.target.checked)}
                className="accent-amber-400"
              />
            </label>
          </div>
        </div>
      )}

      {/* Compact Collapsed Trigger */}
      <div className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#090D16]/95 p-1 shadow-xl">
        <button
          type="button"
          onClick={toggleAmbience}
          aria-label={ambienceEnabled ? 'Turn off space ambience' : 'Turn on gentle space ambience'}
          className={`inline-flex items-center gap-1.5 rounded px-2.5 py-2 text-xs font-medium whitespace-nowrap cursor-pointer ${
            ambienceEnabled
              ? 'bg-sky-600 text-white'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          {ambienceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Ambience</span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded bg-[#131B2E] px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-[#1B2640] whitespace-nowrap cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>{isPlaying && !isPaused ? 'Audio Playing' : 'Audio & Access'}</span>
        </button>
      </div>
    </div>
  );
}
