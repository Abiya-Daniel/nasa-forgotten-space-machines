import { useState } from 'react';
import {
  AlertTriangle,
  SearchCheck,
  Camera,
  HelpCircle,
  Skull,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  DIGITAL_MUSEUM_HALLS,
  ALMOST_FAILED_CASES,
  LOST_IN_SPACE_ARCHIVE,
  MISSION_AUTOPSY_CASES,
  SPACECRAFT_GRAVEYARD_ZONES,
  LAST_PHOTOGRAPH_RECORDS,
  UNANSWERED_QUESTIONS,
} from '../data/phase2HistoryData';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { EquipmentItem, PageId } from '../types/equipment';
import { useExperience } from '../context/ExperienceContext';
import { ZoomableNasaImage } from './ZoomableNasaImage';

export type HistoryArchiveSection =
  | 'museum-halls'
  | 'almost-failed'
  | 'lost-autopsy'
  | 'graveyard'
  | 'last-photo'
  | 'mysteries';

interface HistoryArchivesHubProps {
  activeSection: HistoryArchiveSection;
  onSelectSection: (s: HistoryArchiveSection) => void;
  onOpenMachine?: (item: EquipmentItem) => void;
  onNavigate?: (page: PageId) => void;
}

export function HistoryArchivesHub({
  activeSection,
  onSelectSection,
  onOpenMachine,
  onNavigate,
}: HistoryArchivesHubProps) {
  const [autopsyPicks, setAutopsyPicks] = useState<Record<string, number>>({});
  const { unlockBadge } = useExperience();

  const handleAutopsyPick = (caseId: string, optIdx: number, correctIdx: number) => {
    setAutopsyPicks((prev) => ({ ...prev, [caseId]: optIdx }));
    if (optIdx === correctIdx) {
      unlockBadge('badge-engineering-detective');
    }
    unlockBadge('badge-mission-historian');
  };

  return (
    <div className="space-y-8">
      {/* Sub-section Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {(
          [
            { id: 'museum-halls', label: 'Digital Museum (6 Halls)', icon: Landmark },
            { id: 'almost-failed', label: 'Missions That Almost Failed', icon: AlertTriangle },
            { id: 'lost-autopsy', label: 'Lost Archive & Mission Autopsy', icon: SearchCheck },
            { id: 'graveyard', label: 'Spacecraft Graveyard', icon: Skull },
            { id: 'last-photo', label: 'The Last Photograph', icon: Camera },
            { id: 'mysteries', label: 'Unanswered Questions', icon: HelpCircle },
          ] as { id: HistoryArchiveSection; label: string; icon: typeof Landmark }[]
        ).map((s) => {
          const Icon = s.icon;
          const active = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                onSelectSection(s.id);
                unlockBadge('badge-mission-historian');
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                active
                  ? 'bg-amber-500 text-slate-950'
                  : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Digital Space Museum (6 Themed Halls) */}
      {activeSection === 'museum-halls' && (
        <section className="space-y-5">
          <div>
            <div className="font-mono text-xs text-amber-400 uppercase tracking-wider">
              Digital Space Museum · Curated Thematic Exhibition Wings
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              Explore Six Museum Halls of Off-World History
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIGITAL_MUSEUM_HALLS.map((hall) => (
              <article
                key={hall.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-2.5">
                  <div className="font-mono text-xs text-sky-400">{hall.hallNumber}</div>
                  <h3 className="text-lg font-bold text-slate-100">{hall.title}</h3>
                  <p className="text-xs font-medium text-amber-300">{hall.subtitle}</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {hall.curatorialStatement}
                  </p>
                  <div className="rounded border border-slate-800 bg-[#07090E] p-3 text-xs text-slate-300">
                    <span className="font-mono text-sky-400 block mb-1">Archival Highlight</span>
                    {hall.highlightFact}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex flex-wrap gap-1.5">
                    {hall.featuredIds.map((eqId) => {
                      const item = EQUIPMENT_DATA.find((e) => e.id === eqId);
                      if (!item) return null;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onOpenMachine?.(item)}
                          className="rounded border border-slate-700 bg-[#07090E] px-2 py-1 text-[11px] text-slate-200 hover:border-amber-400 cursor-pointer"
                        >
                          {item.name.split(' (')[0]}
                        </button>
                      );
                    })}
                  </div>

                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate(hall.actionTarget.page)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <span>{hall.actionTarget.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. Missions That Almost Failed */}
      {activeSection === 'almost-failed' && (
        <section className="space-y-5">
          <div>
            <div className="font-mono text-xs text-amber-400 uppercase tracking-wider">
              Engineering Resilience Under Crisis
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              The Missions That Almost Failed — And How Ingenuity Saved Them
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ALMOST_FAILED_CASES.map((c) => (
              <article
                key={c.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F18] overflow-hidden flex flex-col"
              >
                <div className="grid grid-cols-1 sm:grid-cols-5">
                  <div className="sm:col-span-2 bg-[#05070C]">
                    <ZoomableNasaImage
                      src={c.photoUrl}
                      fallbackSrc={c.photoUrl}
                      alt={c.title}
                      caption={c.mission}
                      credit={c.credit}
                      nasaId={c.nasaId}
                      aspectClassName="aspect-[4/3] sm:h-full w-full"
                    />
                  </div>
                  <div className="sm:col-span-3 p-5 space-y-3">
                    <div className="font-mono text-xs text-sky-400">
                      {c.mission} · NASA ID {c.nasaId}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{c.title}</h3>
                    <div className="space-y-2 text-xs leading-relaxed">
                      <p className="text-rose-200/90">
                        <strong className="text-rose-300">Crisis:</strong> {c.crisis}
                      </p>
                      <p className="text-sky-200/90">
                        <strong className="text-sky-300">Engineering Fix:</strong> {c.engineeringFix}
                      </p>
                      <p className="text-emerald-200/90">
                        <strong className="text-emerald-300">Outcome:</strong> {c.outcome}
                      </p>
                    </div>
                    <div className="rounded border border-slate-800 bg-[#07090E] p-2.5 text-[11px] text-amber-200">
                      <strong>Legacy Lesson:</strong> {c.lessonLearned}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. Lost in Space Archive & Mission Autopsy Lab */}
      {activeSection === 'lost-autopsy' && (
        <section className="space-y-10">
          {/* Interactive Mission Autopsy Lab */}
          <div className="space-y-5">
            <div>
              <div className="font-mono text-xs text-sky-400 uppercase tracking-wider">
                Interactive Forensics · Mission Autopsy Laboratory
              </div>
              <h2 className="mt-1 text-2xl font-bold text-slate-100">
                Inspect Telemetry Clues &amp; Solve Historic Spacecraft Losses
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
                Review documented investigation board evidence for three famous Mars mission losses and identify each root cause to unlock the Engineering Detective badge.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {MISSION_AUTOPSY_CASES.map((ac) => {
                const picked = autopsyPicks[ac.id];
                const isSolved = picked === ac.correctIndex;
                return (
                  <article
                    key={ac.id}
                    className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="font-mono text-xs text-amber-400">{ac.year}</div>
                      <h3 className="text-lg font-bold text-slate-100">{ac.mission}</h3>

                      <div className="space-y-2">
                        {ac.clues.map((cl) => (
                          <div
                            key={cl.label}
                            className="rounded border border-slate-800 bg-[#07090E] p-2.5 text-xs"
                          >
                            <div className="font-mono text-[11px] text-sky-400">{cl.label}</div>
                            <p className="text-slate-300 mt-0.5 leading-relaxed">{cl.evidence}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 space-y-2">
                        <div className="text-xs font-bold text-slate-100">{ac.question}</div>
                        {ac.options.map((opt, idx) => {
                          const isChosen = picked === idx;
                          const isRight = idx === ac.correctIndex;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAutopsyPick(ac.id, idx, ac.correctIndex)}
                              className={`w-full rounded-md border p-2.5 text-left text-xs leading-relaxed cursor-pointer transition-colors ${
                                picked !== undefined
                                  ? isRight
                                    ? 'border-emerald-500 bg-emerald-950/30 text-emerald-100'
                                    : isChosen
                                      ? 'border-rose-500 bg-rose-950/30 text-rose-100'
                                      : 'border-slate-800 bg-[#07090E] text-slate-500'
                                  : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-amber-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {picked !== undefined && (
                      <div className="rounded-md border border-slate-700 bg-[#07090E] p-3 text-xs space-y-1.5">
                        <div
                          className={`inline-flex items-center gap-1.5 font-semibold ${
                            isSolved ? 'text-emerald-400' : 'text-amber-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Official Investigation Finding</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{ac.forensicVerdict}</p>
                        <p className="text-sky-300 text-[11px]">
                          <strong>Engineering Legacy:</strong> {ac.legacyFix}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Lost in Space Archive */}
          <div className="space-y-4 border-t border-slate-800 pt-8">
            <h3 className="text-xl font-bold text-slate-100">
              Lost in Space Archive: Verified Findings vs Unconfirmed Mysteries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {LOST_IN_SPACE_ARCHIVE.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-lg border border-slate-800 bg-[#0B0F18] p-5 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-amber-400">
                      {entry.agency} · {entry.year}
                    </span>
                    <span className="rounded border border-slate-700 bg-[#07090E] px-2 py-0.5 text-[11px] text-sky-300">
                      {entry.fateCategory}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-100">{entry.name}</h4>
                  <p className="text-xs text-slate-400">Region: {entry.body}</p>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-emerald-300">Verified Record:</strong> {entry.confirmedCause}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-amber-300">Still Unconfirmed:</strong> {entry.unconfirmedMystery}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Spacecraft Graveyard */}
      {activeSection === 'graveyard' && (
        <section className="space-y-5">
          <div>
            <div className="font-mono text-xs text-amber-400 uppercase tracking-wider">
              End-of-Mission Disposal &amp; Planetary Protection
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              Spacecraft Graveyards: Point Nemo, Supersynchronous Orbits &amp; Heritage Zones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPACECRAFT_GRAVEYARD_ZONES.map((z) => (
              <article
                key={z.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-3"
              >
                <div className="font-mono text-xs text-sky-400">{z.countNote}</div>
                <h3 className="text-lg font-bold text-slate-100">{z.name}</h3>
                <p className="text-xs font-mono text-amber-300">{z.location}</p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {z.policyReason}
                </p>
                <div className="rounded border border-slate-800 bg-[#07090E] p-3 text-xs text-slate-300">
                  <strong className="text-slate-100">Notable Hardware:</strong> {z.examples}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. The Last Photograph */}
      {activeSection === 'last-photo' && (
        <section className="space-y-5">
          <div>
            <div className="font-mono text-xs text-sky-400 uppercase tracking-wider">
              Archival Farewell Frames
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              The Last Photograph: True Final Frames vs Final Planetary Portraits
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
              Every record explicitly labels whether an image was the literal final surface transmission before silence or a late-mission camera shutdown portrait while radio science continued.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LAST_PHOTOGRAPH_RECORDS.map((lp) => (
              <article
                key={lp.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F18] overflow-hidden flex flex-col"
              >
                <ZoomableNasaImage
                  src={lp.imageUrl}
                  fallbackSrc={lp.imageUrl}
                  alt={lp.machineName}
                  caption={lp.mission}
                  credit={lp.credit}
                  sourceUrl={lp.sourceUrl}
                  nasaId={lp.nasaId}
                  aspectClassName="aspect-[16/9] w-full"
                />
                <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono text-amber-400">{lp.distinction}</span>
                      <span className="font-mono text-slate-400">{lp.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{lp.machineName}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{lp.story}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                    <span>Credit: {lp.credit}</span>
                    <a
                      href={lp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                    >
                      <span>NASA Archive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 6. Unanswered Questions Archive */}
      {activeSection === 'mysteries' && (
        <section className="space-y-5">
          <div>
            <div className="font-mono text-xs text-amber-400 uppercase tracking-wider">
              Frontiers of Ongoing Science
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              Unanswered Questions Left Behind by Historic Machines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UNANSWERED_QUESTIONS.map((uq) => (
              <article
                key={uq.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-sky-400">{uq.relatedMachine}</span>
                  <span className="rounded border border-slate-700 bg-[#07090E] px-2 py-0.5 text-amber-300">
                    {uq.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 leading-snug">{uq.question}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{uq.background}</p>
                <div className="rounded border border-slate-800 bg-[#07090E] p-3 text-xs space-y-1.5">
                  <p className="text-emerald-200">
                    <strong>What Instruments Confirmed:</strong> {uq.whatWeKnow}
                  </p>
                  <p className="text-amber-200">
                    <strong>Why It Remains Open:</strong> {uq.whyStillOpen}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
