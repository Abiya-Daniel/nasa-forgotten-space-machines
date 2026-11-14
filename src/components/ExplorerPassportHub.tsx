import { useState } from 'react';
import {
  Award,
  Shield,
  Users,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Send,
  Star,
  HelpCircle,
} from 'lucide-react';
import { EXPLORER_BADGES } from '../data/museumExperiencesData';
import { WEEKLY_CHALLENGES } from '../data/phase2InteractiveData';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { useExperience } from '../context/ExperienceContext';

function computeExplorerRank(score: number): { title: string; nextAt: number } {
  if (score >= 16) return { title: 'Chief Space Archivist', nextAt: 24 };
  if (score >= 10) return { title: 'Planetary Researcher', nextAt: 16 };
  if (score >= 5) return { title: 'Orbital Navigator', nextAt: 10 };
  return { title: 'Cadet Space Explorer', nextAt: 5 };
}

export function ExplorerPassportHub() {
  const {
    earnedBadges,
    exploredMachines,
    completedSims,
    completedTours,
    favorites,
    unlockBadge,
    communityPosts,
    addCommunityPost,
  } = useExperience();

  // Weekly challenge state
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});

  // Community board state
  const [author, setAuthor] = useState('');
  const [machineName, setMachineName] = useState(EQUIPMENT_DATA[0].name);
  const [note, setNote] = useState('');

  const passportScore =
    earnedBadges.length * 2 +
    exploredMachines.length +
    completedSims.length +
    completedTours.length;
  const rank = computeExplorerRank(passportScore);
  const rankPct = Math.min(100, Math.round((passportScore / rank.nextAt) * 100));

  const challenge = WEEKLY_CHALLENGES[challengeIdx] || WEEKLY_CHALLENGES[0];
  const chosenOpt = selectedOptions[challenge.id];
  const isAnswered = typeof chosenOpt === 'number';
  const isRight = chosenOpt === challenge.correctIndex;

  const handleSelectOption = (idx: number) => {
    setSelectedOptions((prev) => ({ ...prev, [challenge.id]: idx }));
    if (idx === challenge.correctIndex) {
      unlockBadge('badge-space-scientist');
    }
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    addCommunityPost(author || 'Visiting Explorer', machineName, note);
    setNote('');
  };

  return (
    <div className="space-y-10">
      {/* 1. Explorer Passport Summary (#23) */}
      <section className="rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Shield className="w-4 h-4" />
              <span>Explorer Passport · Local Progress Credential</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold text-white">{rank.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Progress is stored locally in your browser across explored spacecraft, guided museum tours, 3D simulations, and badges.
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/40 bg-[#121722] px-4 py-2.5 text-right">
            <div className="text-[10px] font-mono uppercase text-amber-400">
              Passport Points
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-white">
              {passportScore}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-lg border border-slate-800 bg-[#07090E] p-3.5">
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
              {earnedBadges.length}/{EXPLORER_BADGES.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Badges Earned</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#07090E] p-3.5">
            <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
              {exploredMachines.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Machines Studied</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#07090E] p-3.5">
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {completedSims.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Simulations Cleared</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#07090E] p-3.5">
            <div className="text-xl font-bold font-mono text-purple-300 tabular-nums">
              {completedTours.length}/5
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Guided Tours Done</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-[#07090E] p-3.5">
            <div className="text-xl font-bold font-mono text-rose-300 tabular-nums">
              {favorites.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Saved Favorites</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Rank Progress</span>
            <span>{rankPct}% toward next tier</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-[width] duration-300"
              style={{ width: `${rankPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. All 12 Mission Badges (#24) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Award className="w-4 h-4" />
          <span>Mission Achievement Badges ({earnedBadges.length}/{EXPLORER_BADGES.length} Unlocked)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {EXPLORER_BADGES.map((badge) => {
            const unlocked = earnedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-lg border p-4 space-y-2 transition-colors ${
                  unlocked
                    ? 'border-amber-400/70 bg-[#121826]'
                    : 'border-slate-800 bg-[#0B0F18] opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <Award
                    className={`w-5 h-5 ${
                      unlocked ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                      unlocked
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {unlocked ? 'Earned' : 'Locked'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{badge.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {badge.description}
                </p>
                <div className="text-[11px] font-mono text-sky-400 pt-1 border-t border-slate-800/80">
                  Goal: {badge.criterion}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Challenge of the Week (#29) + Explorer of the Month (#26) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <CalendarCheck className="w-4 h-4" />
              <span>Mission Challenge of the Week</span>
            </div>
            <div className="flex gap-1.5">
              {WEEKLY_CHALLENGES.map((wc, idx) => (
                <button
                  key={wc.id}
                  type="button"
                  onClick={() => setChallengeIdx(idx)}
                  className={`rounded px-2.5 py-1 text-[11px] font-mono cursor-pointer ${
                    idx === challengeIdx
                      ? 'bg-amber-500 text-slate-950 font-semibold'
                      : 'bg-[#07090E] text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {wc.weekLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-mono text-[11px] text-sky-400">
              Topic: {challenge.missionFocus}
            </div>
            <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {challenge.prompt}
            </p>
          </div>

          <div className="space-y-2">
            {challenge.options.map((opt, idx) => {
              const selected = chosenOpt === idx;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left rounded-lg border px-4 py-3 text-xs sm:text-sm transition-colors cursor-pointer ${
                    selected
                      ? idx === challenge.correctIndex
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-100'
                        : 'border-rose-400 bg-rose-950/40 text-rose-100'
                      : 'border-slate-800 bg-[#07090E] text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() =>
                setShowHint((prev) => ({
                  ...prev,
                  [challenge.id]: !prev[challenge.id],
                }))
              }
              className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint[challenge.id] ? 'Hide Hint' : 'Show Engineering Hint'}</span>
            </button>
          </div>

          {showHint[challenge.id] && (
            <p className="rounded border border-sky-500/30 bg-[#08101E] p-3 text-xs text-sky-200">
              Hint: {challenge.hint}
            </p>
          )}

          {isAnswered && (
            <div
              className={`rounded-lg border p-3.5 text-xs leading-relaxed flex items-start gap-2.5 ${
                isRight
                  ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-100'
                  : 'border-rose-500/50 bg-rose-950/30 text-rose-100'
              }`}
            >
              {isRight ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold mb-1">
                  {isRight
                    ? 'Correct — Space Scientist Badge Unlocked!'
                    : 'Not quite — Review the physics below:'}
                </div>
                <p>{challenge.explanation}</p>
              </div>
            </div>
          )}
        </section>

        {/* Space Explorer of the Month (#26 — Honest Local/Benchmark Showcase) */}
        <section className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Space Explorer of the Month</span>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
              Sample Showcase
            </span>
          </div>

          <div className="rounded-lg border border-amber-500/30 bg-[#121622] p-4 space-y-2">
            <div className="text-xs font-mono text-amber-400">
              Challenge Benchmark Profile
            </div>
            <h3 className="text-lg font-bold text-white">
              Dr. Priya Nair · Student Astronomy Club Mentor
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sample milestone highlight illustrating what full museum completion looks like: all 5 Guided Museum Tours cleared, 3D Mars Rover geological samples recovered, and Deep Space Light-Delay simulations tested.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center font-mono text-xs">
              <div className="rounded bg-[#07090E] p-2">
                <div className="text-amber-400 font-bold">12/12</div>
                <div className="text-[10px] text-slate-400">Badges</div>
              </div>
              <div className="rounded bg-[#07090E] p-2">
                <div className="text-sky-400 font-bold">5/5</div>
                <div className="text-[10px] text-slate-400">Tours</div>
              </div>
              <div className="rounded bg-[#07090E] p-2">
                <div className="text-emerald-400 font-bold">31</div>
                <div className="text-[10px] text-slate-400">Machines</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Transparency Note: This featured explorer card is a static sample benchmark. Your own Explorer Passport stats above update live from your local browser activity.
          </p>
        </section>
      </div>

      {/* 4. Community Discovery Board (#25 — Honest Local Browser Prototype) */}
      <section className="rounded-xl border border-slate-800 bg-[#0B0F18] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Users className="w-4 h-4" />
              <span>Community Discovery Board</span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-white">
              Share Your Favorite Machine &amp; Discovery Notes
            </h3>
          </div>
          <span className="rounded border border-sky-500/40 bg-sky-950/40 px-2.5 py-1 font-mono text-[11px] text-sky-300">
            Local Browser Prototype · Saved Locally
          </span>
        </div>

        <form onSubmit={handlePost} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your Name / Callsign"
            aria-label="Your Name or Callsign"
            maxLength={40}
            className="md:col-span-3 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs text-slate-100 placeholder-slate-500"
          />
          <select
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
            aria-label="Favorite Space Machine"
            className="md:col-span-3 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs text-slate-100 cursor-pointer"
          >
            {EQUIPMENT_DATA.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What fascinated you most about this spacecraft?"
            aria-label="Discovery reflection"
            maxLength={240}
            className="md:col-span-4 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs text-slate-100 placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!note.trim()}
            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Note</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border border-slate-800 bg-[#07090E] p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                <span className="text-amber-400 font-semibold">{post.author}</span>
                <span className="text-slate-500">{post.dateLabel}</span>
              </div>
              <div className="text-xs font-semibold text-sky-300">
                {post.machineName}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{post.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
