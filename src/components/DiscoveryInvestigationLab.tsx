import { useState, useEffect } from 'react';
import {
  Microscope,
  CheckCircle2,
  XCircle,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { DISCOVERY_INVESTIGATIONS } from '../data/museumExperiencesData';
import { useExperience } from '../context/ExperienceContext';
import { ZoomableNasaImage } from './ZoomableNasaImage';

export function DiscoveryInvestigationLab() {
  const [activeId, setActiveId] = useState<string>(DISCOVERY_INVESTIGATIONS[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const { savedDiscoveries, toggleSavedDiscovery, unlockBadge } = useExperience();

  const activeCase =
    DISCOVERY_INVESTIGATIONS.find((c) => c.id === activeId) ||
    DISCOVERY_INVESTIGATIONS[0];

  const solvedCount = DISCOVERY_INVESTIGATIONS.filter(
    (c) => selectedAnswers[c.id] === c.correctIndex
  ).length;

  useEffect(() => {
    if (solvedCount >= 3) {
      unlockBadge('badge-investigator');
    }
  }, [solvedCount, unlockBadge]);

  const chosenIdx = selectedAnswers[activeCase.id];
  const isAnswered = chosenIdx !== undefined;
  const isCorrect = chosenIdx === activeCase.correctIndex;
  const isSaved = savedDiscoveries.includes(activeCase.id);

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
            <Microscope className="w-4 h-4" />
            <span>Planetary Evidence Analysis · {solvedCount}/{DISCOVERY_INVESTIGATIONS.length} Investigated</span>
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-100">
            Scientific Discovery Investigation Lab
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Examine authentic planetary observations captured by NASA hardware, select
            the scientific hypothesis supported by spectrometer and camera evidence, and
            bookmark breakthroughs for your personal explorer log. Solve 3+ cases to
            unlock the <strong>Planetary Detective</strong> badge.
          </p>
        </div>
      </div>

      {/* Case Selector Rail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {DISCOVERY_INVESTIGATIONS.map((item) => {
          const selected = item.id === activeCase.id;
          const solved = selectedAnswers[item.id] === item.correctIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`text-left rounded-md border p-3.5 transition-colors cursor-pointer ${
                selected
                  ? 'border-amber-400 bg-[#12192A] text-white'
                  : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                <span className="text-sky-400">{item.world}</span>
                {solved && (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs sm:text-sm font-semibold line-clamp-2">
                {item.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Investigation Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-lg border border-slate-800 bg-[#0B0F18] p-5 sm:p-6">
        <div className="lg:col-span-5 rounded-md overflow-hidden border border-slate-800 bg-[#07090E]">
          <ZoomableNasaImage
            src={activeCase.photo.imageUrl}
            fallbackSrc={activeCase.photo.fallbackUrl}
            alt={activeCase.photo.title}
            caption={activeCase.photo.title}
            credit={activeCase.photo.credit}
            sourceUrl={activeCase.photo.sourceUrl}
            nasaId={activeCase.photo.nasaId}
            aspectClassName="aspect-[4/3] w-full"
          />
          <div className="p-3.5 text-xs text-slate-400 border-t border-slate-800/80 space-y-1">
            <div className="font-mono text-[11px] text-sky-400">
              Authentic NASA Evidence · ID: {activeCase.photo.nasaId}
            </div>
            <p className="text-slate-200 font-medium">{activeCase.photo.title}</p>
            <p>Credit: {activeCase.photo.credit}</p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="font-mono text-xs text-amber-400">
                {activeCase.machine} · {activeCase.world}
              </div>
              <h3 className="mt-1 text-xl font-bold text-slate-100">
                {activeCase.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => toggleSavedDiscovery(activeCase.id)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isSaved
                  ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                  : 'border-slate-700 bg-[#07090E] text-slate-300 hover:border-slate-500'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved Discovery' : 'Save Discovery'}</span>
            </button>
          </div>

          <div className="rounded-md border border-slate-800 bg-[#07090E] p-4 space-y-1.5">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
              Field Observation
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {activeCase.observationPrompt}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-100">{activeCase.question}</p>
            <div className="space-y-2">
              {activeCase.options.map((opt, idx) => {
                const picked = chosenIdx === idx;
                const correctOpt = idx === activeCase.correctIndex;
                let cls =
                  'border-slate-800 bg-[#07090E] text-slate-200 hover:border-sky-500';
                if (isAnswered) {
                  if (correctOpt) {
                    cls = 'border-emerald-500 bg-emerald-950/30 text-emerald-100';
                  } else if (picked && !correctOpt) {
                    cls = 'border-rose-500 bg-rose-950/30 text-rose-100';
                  } else {
                    cls = 'border-slate-800/60 bg-[#07090E] text-slate-500';
                  }
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setSelectedAnswers((prev) => ({ ...prev, [activeCase.id]: idx }))
                    }
                    className={`w-full text-left rounded-md border p-3.5 text-xs sm:text-sm transition-colors cursor-pointer ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div className="rounded-md border border-slate-700 bg-[#0D1320] p-4 space-y-3 text-xs sm:text-sm">
              <div
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  isCorrect ? 'text-emerald-400' : 'text-amber-300'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>
                  {isCorrect
                    ? 'Scientific Interpretation Confirmed'
                    : 'Reviewed Against Instrument Data'}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                {activeCase.scientificInterpretation}
              </p>
              <div className="border-t border-slate-800 pt-2.5">
                <span className="font-mono text-xs uppercase text-amber-400">
                  Why It Matters:{' '}
                </span>
                <span className="text-slate-300">{activeCase.meaningForScience}</span>
              </div>
              <div className="pt-1">
                <a
                  href={activeCase.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sky-400 hover:underline"
                >
                  <span>Source: {activeCase.sourceLabel}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
