import { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Printer,
  Search,
  Award,
  Download,
  Trash2,
} from 'lucide-react';
import {
  QUIZ_QUESTIONS,
  TRUE_FALSE_QUESTIONS,
  MATCHING_PAIRS,
  ORDERING_MILESTONES,
  GUESS_CRAFT_PUZZLES,
  MISSION_SCENARIOS,
  GLOSSARY_TERMS,
} from '../data/learningData';
import { EXPLORER_BADGES } from '../data/museumExperiencesData';
import { GlossaryTerm, OrderingMilestone } from '../types/equipment';
import { BuildSpacecraftLab } from '../components/BuildSpacecraftLab';
import { useExperience } from '../context/ExperienceContext';

type LabTab =
  | 'mcq'
  | 'tf'
  | 'matching'
  | 'ordering'
  | 'guess'
  | 'challenges'
  | 'builder'
  | 'glossary'
  | 'achievements';

const INITIAL_SHUFFLED_ORDER: OrderingMilestone[] = [
  ORDERING_MILESTONES[2],
  ORDERING_MILESTONES[0],
  ORDERING_MILESTONES[5],
  ORDERING_MILESTONES[1],
  ORDERING_MILESTONES[6],
  ORDERING_MILESTONES[3],
  ORDERING_MILESTONES[7],
  ORDERING_MILESTONES[4],
];

const INITIAL_DISCOVERIES = [
  MATCHING_PAIRS[3],
  MATCHING_PAIRS[0],
  MATCHING_PAIRS[5],
  MATCHING_PAIRS[1],
  MATCHING_PAIRS[7],
  MATCHING_PAIRS[2],
  MATCHING_PAIRS[6],
  MATCHING_PAIRS[4],
];

export function LearningLabPage() {
  const [tab, setTab] = useState<LabTab>('mcq');

  // 1. Multiple-Choice state
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});

  // 2. True/False state
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean>>({});

  // 3. Matching state
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null);
  const [showMatchHints, setShowMatchHints] = useState(false);

  // 4. Ordering state
  const [orderList, setOrderList] = useState<OrderingMilestone[]>(INITIAL_SHUFFLED_ORDER);
  const [orderChecked, setOrderChecked] = useState(false);

  // 5. Guess the Spacecraft state
  const [revealedClues, setRevealedClues] = useState<Record<string, number>>({});
  const [guessAnswers, setGuessAnswers] = useState<Record<string, string>>({});

  // 6. Mission Scenarios state
  const [scenarioChoices, setScenarioChoices] = useState<Record<string, number>>({});

  // 7. Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCat, setGlossaryCat] = useState<'all' | GlossaryTerm['category']>('all');

  // 8. Explorer Certificate name
  const [explorerName, setExplorerName] = useState('Young Explorer');

  const {
    earnedBadges,
    unlockBadge,
    exploredMachines,
    favorites,
    savedDiscoveries,
    clearExplorerProgress,
  } = useExperience();

  // Progress calculation
  const mcqCorrect = QUIZ_QUESTIONS.filter((q) => mcqAnswers[q.id] === q.correctIndex).length;
  const tfCorrect = TRUE_FALSE_QUESTIONS.filter((q) => tfAnswers[q.id] === q.isTrue).length;
  const guessCorrect = GUESS_CRAFT_PUZZLES.filter(
    (p) => guessAnswers[p.id] === p.answerName
  ).length;
  const orderCorrectCount = orderList.filter(
    (item, idx) => item.id === ORDERING_MILESTONES[idx].id
  ).length;
  const scenariosDone = Object.keys(scenarioChoices).length;

  useEffect(() => {
    if (mcqCorrect >= 7 || tfCorrect >= 7) {
      unlockBadge('badge-quiz-master');
    }
  }, [mcqCorrect, tfCorrect, unlockBadge]);

  useEffect(() => {
    if (scenariosDone >= MISSION_SCENARIOS.length) {
      unlockBadge('badge-mission-controller');
    }
  }, [scenariosDone, unlockBadge]);

  const totalActivitiesDone =
    (Object.keys(mcqAnswers).length === QUIZ_QUESTIONS.length ? 1 : 0) +
    (Object.keys(tfAnswers).length === TRUE_FALSE_QUESTIONS.length ? 1 : 0) +
    (matchedIds.length === MATCHING_PAIRS.length ? 1 : 0) +
    (orderChecked && orderCorrectCount === ORDERING_MILESTONES.length ? 1 : 0) +
    (Object.keys(guessAnswers).length === GUESS_CRAFT_PUZZLES.length ? 1 : 0) +
    (scenariosDone === MISSION_SCENARIOS.length ? 1 : 0);

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      if (glossaryCat !== 'all' && t.category !== glossaryCat) return false;
      if (glossarySearch.trim()) {
        const q = glossarySearch.toLowerCase();
        return (
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.example.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [glossarySearch, glossaryCat]);

  const handleSelectDiscovery = (pairId: string) => {
    if (!selectedMachineId) {
      setMatchFeedback('First select a NASA machine on the left column.');
      return;
    }
    if (matchedIds.includes(pairId)) return;

    if (selectedMachineId === pairId) {
      setMatchedIds((prev) => [...prev, pairId]);
      setSelectedMachineId(null);
      setMatchFeedback('Correct match! Select the next machine.');
    } else {
      setMatchFeedback('Not quite that match—check the mission hints and try again.');
    }
  };

  const moveOrderItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= orderList.length) return;
    const copy = [...orderList];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setOrderList(copy);
    setOrderChecked(false);
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deep space background
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#05070D');
    grad.addColorStop(1, '#0D192E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Subtle stars
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 197) % 1160) + 20;
      const sy = ((i * 313) % 760) + 20;
      ctx.fillRect(sx, sy, 2, 2);
    }

    // Outer frame
    ctx.strokeStyle = '#E8A95B';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 1120, 720);
    ctx.strokeStyle = '#4C9AFF';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(56, 56, 1088, 688);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#E8A95B';
    ctx.font = 'bold 20px monospace';
    ctx.fillText("NASA'S FORGOTTEN SPACE MACHINES · EDUCATIONAL ARCHIVE", 600, 120);

    ctx.fillStyle = '#F4F7FB';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('SPACE EXPLORER CERTIFICATE', 600, 200);

    ctx.fillStyle = '#9BA8BA';
    ctx.font = '22px sans-serif';
    ctx.fillText('Awarded in recognition of exploring off-world engineering & science to', 600, 275);

    ctx.fillStyle = '#4C9AFF';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText((explorerName.trim() || 'Young Explorer').slice(0, 32), 600, 360);

    ctx.fillStyle = '#F4F7FB';
    ctx.font = '20px monospace';
    ctx.fillText(
      `Spacecraft Inspected: ${exploredMachines.length}   ·   Badges Earned: ${earnedBadges.length}/${EXPLORER_BADGES.length}   ·   Saved Discoveries: ${savedDiscoveries.length}`,
      600,
      460
    );

    ctx.fillStyle = '#9BA8BA';
    ctx.font = '18px sans-serif';
    ctx.fillText(
      'Every machine has a story. Every discovery leaves a legacy.',
      600,
      540
    );

    ctx.fillStyle = '#E8A95B';
    ctx.font = '16px monospace';
    ctx.fillText(
      `Issued ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Independent Student Educational Project`,
      600,
      670
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'space-explorer-certificate.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Header + Progress */}
      <div className="no-print flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Young Explorers Educational Centre · Student-Friendly Science Lab
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-100">
            Interactive Learning Lab &amp; Games
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Test your knowledge with NASA-verified quizzes, match iconic machines to
            their breakthroughs, order space history, and solve engineering challenges.
          </p>
        </div>

        <div className="rounded-lg border border-slate-800 bg-[#0B0F18] p-4 min-w-[260px] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Explorer Progress</span>
            </span>
            <span className="font-mono text-sky-400 tabular-nums">
              {totalActivitiesDone} / 6 Modules
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-[width] duration-300"
              style={{ width: `${Math.round((totalActivitiesDone / 6) * 100)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline cursor-pointer pt-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Study Worksheet</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        className="no-print flex flex-wrap gap-1.5 border-b border-slate-800 pb-4"
        role="tablist"
        aria-label="Learning lab activities"
      >
        {(
          [
            { id: 'mcq', label: `Quiz (${mcqCorrect}/${QUIZ_QUESTIONS.length})` },
            { id: 'tf', label: `True / False (${tfCorrect}/${TRUE_FALSE_QUESTIONS.length})` },
            { id: 'matching', label: `Matching (${matchedIds.length}/${MATCHING_PAIRS.length})` },
            { id: 'ordering', label: 'Timeline Ordering' },
            { id: 'guess', label: `Guess Spacecraft (${guessCorrect}/${GUESS_CRAFT_PUZZLES.length})` },
            { id: 'challenges', label: `Mission Challenges (${scenariosDone}/${MISSION_SCENARIOS.length})` },
            { id: 'builder', label: 'Build a Spacecraft' },
            { id: 'glossary', label: `Glossary (${GLOSSARY_TERMS.length})` },
            { id: 'achievements', label: `Badges & Certificate (${earnedBadges.length}/${EXPLORER_BADGES.length})` },
          ] as { id: LabTab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              tab === t.id
                ? 'bg-amber-500 text-slate-950'
                : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MULTIPLE CHOICE QUIZ */}
      {tab === 'mcq' && (
        <section className="no-print space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Multiple-Choice Mission Quiz
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Score: <strong className="text-amber-400">{mcqCorrect}</strong> out of{' '}
                {QUIZ_QUESTIONS.length} correct ({Object.keys(mcqAnswers).length} answered)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMcqAnswers({})}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Quiz</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const chosen = mcqAnswers[q.id];
              const answered = chosen !== undefined;
              const isRight = chosen === q.correctIndex;
              return (
                <article
                  key={q.id}
                  className="rounded-lg border border-slate-800 bg-[#0B0F18] p-5 space-y-4"
                >
                  <div className="text-xs font-mono text-sky-400">
                    Question {idx + 1} · {q.sourceLabel}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                    {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const picked = chosen === optIdx;
                      const correctOpt = optIdx === q.correctIndex;
                      let style =
                        'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-600';
                      if (answered) {
                        if (correctOpt) {
                          style = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200';
                        } else if (picked && !correctOpt) {
                          style = 'border-rose-500/80 bg-rose-950/30 text-rose-200';
                        } else {
                          style = 'border-slate-800/60 bg-[#07090E] text-slate-500';
                        }
                      }
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            setMcqAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`w-full text-left rounded-md border px-3.5 py-2.5 text-xs sm:text-sm transition-colors cursor-pointer ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div className="rounded-md border border-slate-800 bg-[#07090E] p-3 text-xs space-y-1">
                      <div
                        className={`inline-flex items-center gap-1.5 font-semibold ${
                          isRight ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {isRight ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>{isRight ? 'Correct!' : 'Review Explanation:'}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: TRUE OR FALSE QUIZ */}
      {tab === 'tf' && (
        <section className="no-print space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Fact or Myth? True / False Quiz
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Score: <strong className="text-amber-400">{tfCorrect}</strong> /{' '}
                {TRUE_FALSE_QUESTIONS.length}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTfAnswers({})}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TRUE_FALSE_QUESTIONS.map((item, idx) => {
              const ans = tfAnswers[item.id];
              const hasAns = ans !== undefined;
              const isRight = ans === item.isTrue;
              return (
                <article
                  key={item.id}
                  className="rounded-lg border border-slate-800 bg-[#0B0F18] p-5 space-y-4"
                >
                  <div className="text-xs font-mono text-sky-400">
                    Statement {idx + 1} · {item.sourceLabel}
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                    &ldquo;{item.statement}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {([true, false] as const).map((val) => {
                      const picked = ans === val;
                      return (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() =>
                            setTfAnswers((prev) => ({ ...prev, [item.id]: val }))
                          }
                          className={`flex-1 rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                            picked
                              ? val === item.isTrue
                                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                                : 'border-rose-500 bg-rose-950/40 text-rose-200'
                              : 'border-slate-700 bg-[#07090E] text-slate-200 hover:border-slate-500'
                          }`}
                        >
                          {val ? 'True' : 'False'}
                        </button>
                      );
                    })}
                  </div>
                  {hasAns && (
                    <div className="rounded-md border border-slate-800 bg-[#07090E] p-3 text-xs space-y-1">
                      <div
                        className={`font-semibold ${
                          isRight ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {isRight ? 'Correct!' : 'Correction:'}
                      </div>
                      <p className="text-slate-300 leading-relaxed">{item.explanation}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: SPACECRAFT MATCHING GAME */}
      {tab === 'matching' && (
        <section className="no-print space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Match Each NASA Machine to Its Scientific Discovery
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Step 1: Click a machine on the left. Step 2: Click its matching discovery on the right. ({matchedIds.length}/{MATCHING_PAIRS.length} matched)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMatchHints((h) => !h)}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-sky-300 hover:border-sky-500 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showMatchHints ? 'Hide Hints' : 'Show Hints'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMatchedIds([]);
                  setSelectedMachineId(null);
                  setMatchFeedback(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {matchFeedback && (
            <div className="rounded-md border border-amber-500/40 bg-[#101624] px-4 py-2.5 text-xs text-amber-200">
              {matchFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                1. NASA Spacecraft
              </div>
              {MATCHING_PAIRS.map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                const isSelected = selectedMachineId === pair.id;
                return (
                  <button
                    key={pair.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => setSelectedMachineId(pair.id)}
                    className={`w-full text-left rounded-md border p-3.5 text-sm transition-colors cursor-pointer ${
                      isMatched
                        ? 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300 opacity-75'
                        : isSelected
                          ? 'border-amber-400 bg-[#141E33] text-white font-semibold'
                          : 'border-slate-800 bg-[#0B0F18] text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{pair.machine}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    {showMatchHints && !isMatched && (
                      <p className="mt-1 text-xs text-slate-400 font-normal">
                        Hint: {pair.hint}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                2. Scientific Discovery / Breakthrough
              </div>
              {INITIAL_DISCOVERIES.map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                return (
                  <button
                    key={pair.id}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleSelectDiscovery(pair.id)}
                    className={`w-full text-left rounded-md border p-3.5 text-xs sm:text-sm transition-colors cursor-pointer ${
                      isMatched
                        ? 'border-emerald-600/60 bg-emerald-950/20 text-emerald-300 opacity-75'
                        : 'border-slate-800 bg-[#0B0F18] text-slate-200 hover:border-sky-400'
                    }`}
                  >
                    {pair.discovery}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: MISSION ORDERING ACTIVITY */}
      {tab === 'ordering' && (
        <section className="no-print space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Chronological Mission Ordering Activity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Use the Up and Down buttons to arrange these 8 historic missions from earliest (top) to newest (bottom).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderChecked(true)}
                className="rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                Check Order
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderList(INITIAL_SHUFFLED_ORDER);
                  setOrderChecked(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {orderChecked && (
            <div className="rounded-md border border-slate-700 bg-[#0B0F18] p-4 text-sm text-slate-200">
              You placed{' '}
              <strong className="text-amber-400">{orderCorrectCount}</strong> out of{' '}
              {ORDERING_MILESTONES.length} milestones in their exact chronological slot.
            </div>
          )}

          <div className="space-y-2.5 max-w-3xl">
            {orderList.map((item, idx) => {
              const isRightSlot = orderChecked && item.id === ORDERING_MILESTONES[idx].id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${
                    orderChecked
                      ? isRightSlot
                        ? 'border-emerald-500/70 bg-emerald-950/20'
                        : 'border-amber-500/60 bg-[#0B0F18]'
                      : 'border-slate-800 bg-[#0B0F18]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-sky-400">#{idx + 1}</span>
                      {orderChecked && (
                        <span className="font-mono text-amber-400">
                          Year: {item.year}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-100 mt-0.5">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-400">{item.detail}</div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveOrderItem(idx, -1)}
                      aria-label={`Move ${item.label} earlier`}
                      className="rounded border border-slate-700 bg-[#07090E] p-2 text-slate-200 hover:border-slate-500 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === orderList.length - 1}
                      onClick={() => moveOrderItem(idx, 1)}
                      aria-label={`Move ${item.label} later`}
                      className="rounded border border-slate-700 bg-[#07090E] p-2 text-slate-200 hover:border-slate-500 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 5: GUESS THE SPACECRAFT */}
      {tab === 'guess' && (
        <section className="no-print space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Guess the Spacecraft ({guessCorrect}/{GUESS_CRAFT_PUZZLES.length} solved)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Reveal clues one by one and identify each historic machine.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setGuessAnswers({});
                setRevealedClues({});
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-200 hover:border-slate-500 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Puzzles</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GUESS_CRAFT_PUZZLES.map((puzzle, idx) => {
              const clueCount = revealedClues[puzzle.id] || 1;
              const picked = guessAnswers[puzzle.id];
              const isSolved = picked === puzzle.answerName;
              return (
                <article
                  key={puzzle.id}
                  className="rounded-lg border border-slate-800 bg-[#0B0F18] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-sky-400">
                      Mystery Spacecraft #{idx + 1}
                    </span>
                    {clueCount < 3 && !picked && (
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedClues((prev) => ({
                            ...prev,
                            [puzzle.id]: Math.min(3, (prev[puzzle.id] || 1) + 1),
                          }))
                        }
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        Reveal Clue {clueCount + 1}/3
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-200">
                    {puzzle.clues.slice(0, clueCount).map((cl, cIdx) => (
                      <p
                        key={cIdx}
                        className="rounded-md border border-slate-800 bg-[#07090E] p-3 leading-relaxed"
                      >
                        {cl}
                      </p>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {puzzle.options.map((opt) => {
                      const active = picked === opt;
                      const isCorrectOpt = opt === puzzle.answerName;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setGuessAnswers((prev) => ({ ...prev, [puzzle.id]: opt }))
                          }
                          className={`rounded-md border px-3 py-2 text-left text-xs font-medium cursor-pointer transition-colors ${
                            picked
                              ? isCorrectOpt
                                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                                : active
                                  ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                                  : 'border-slate-800 bg-[#07090E] text-slate-500'
                              : 'border-slate-700 bg-[#07090E] text-slate-200 hover:border-amber-400'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {picked && (
                    <div className="rounded-md border border-slate-800 bg-[#07090E] p-3 text-xs space-y-1">
                      <div
                        className={`font-semibold ${
                          isSolved ? 'text-emerald-400' : 'text-amber-300'
                        }`}
                      >
                        {isSolved
                          ? `Solved! (${puzzle.mission})`
                          : `Answer: ${puzzle.answerName}`}
                      </div>
                      <p className="text-slate-300">{puzzle.fact}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 6: STUDENT MISSION CHALLENGES */}
      {tab === 'challenges' && (
        <section className="no-print space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Student Engineering Mission Challenges
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Step into NASA mission control and solve real hardware emergencies faced on the Moon, Mars, and interstellar space.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MISSION_SCENARIOS.map((sc) => {
              const selectedIdx = scenarioChoices[sc.id];
              const chosenObj =
                selectedIdx !== undefined ? sc.choices[selectedIdx] : null;
              return (
                <article
                  key={sc.id}
                  className="rounded-lg border border-slate-800 bg-[#0B0F18] p-6 space-y-4"
                >
                  <div className="font-mono text-xs text-amber-400">{sc.machine}</div>
                  <h3 className="text-lg font-bold text-slate-100">{sc.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{sc.situation}</p>

                  <div className="space-y-2">
                    {sc.choices.map((ch, idx) => {
                      const picked = selectedIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setScenarioChoices((prev) => ({ ...prev, [sc.id]: idx }))
                          }
                          className={`w-full text-left rounded-md border p-3 text-xs sm:text-sm transition-colors cursor-pointer ${
                            picked
                              ? ch.isOptimal
                                ? 'border-emerald-500 bg-emerald-950/30 text-emerald-100'
                                : 'border-rose-500 bg-rose-950/30 text-rose-100'
                              : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-sky-500'
                          }`}
                        >
                          {ch.label}
                        </button>
                      );
                    })}
                  </div>

                  {chosenObj && (
                    <div
                      className={`rounded-md border p-3.5 text-xs leading-relaxed ${
                        chosenObj.isOptimal
                          ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                          : 'border-amber-500/50 bg-[#141722] text-amber-200'
                      }`}
                    >
                      <strong>Mission Control Outcome:</strong> {chosenObj.outcome}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 7: SPACE SCIENCE GLOSSARY */}
      {tab === 'glossary' && (
        <section className="no-print space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'all',
                  'Propulsion & Physics',
                  'Instruments & Power',
                  'Planetary Geology',
                  'Deep Space Navigation',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGlossaryCat(cat)}
                  className={`rounded px-3 py-1.5 text-xs font-medium cursor-pointer ${
                    glossaryCat === cat
                      ? 'bg-sky-600 text-white'
                      : 'border border-slate-800 bg-[#0B0F18] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'All Terms' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="search"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Search glossary terms..."
                aria-label="Search space science glossary"
                className="w-full rounded-md border border-slate-800 bg-[#0B0F18] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredGlossary.map((item) => (
              <article
                key={item.term}
                className="rounded-lg border border-slate-800 bg-[#0B0F18] p-5 space-y-2"
              >
                <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
                  {item.category}
                </div>
                <h3 className="text-base font-bold text-slate-100">{item.term}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.definition}
                </p>
                <p className="text-xs text-amber-300/90 pt-1 border-t border-slate-800/80">
                  <strong>Mission Example:</strong> {item.example}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* TAB 8: BUILD A SPACECRAFT LAB */}
      {tab === 'builder' && <BuildSpacecraftLab />}

      {/* TAB 9: ACHIEVEMENT BADGES & CERTIFICATE */}
      {tab === 'achievements' && (
        <section className="no-print space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Explorer Badges &amp; Personal Certificate
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Progress is saved locally in your browser without creating an account. Explored spacecraft: {exploredMachines.length} · Favorites: {favorites.length} · Saved discoveries: {savedDiscoveries.length}
              </p>
            </div>
            <button
              type="button"
              onClick={clearExplorerProgress}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B0F18] px-3 py-2 text-xs text-slate-300 hover:border-rose-500 hover:text-rose-200 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Progress</span>
            </button>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPLORER_BADGES.map((badge) => {
              const unlocked = earnedBadges.includes(badge.id);
              return (
                <article
                  key={badge.id}
                  className={`rounded-lg border p-5 space-y-2 transition-colors ${
                    unlocked
                      ? 'border-amber-400/70 bg-[#111828]'
                      : 'border-slate-800 bg-[#0B0F18] opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className={unlocked ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                      {unlocked ? 'Badge Unlocked' : 'Locked'}
                    </span>
                    <Award className={`w-4 h-4 ${unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{badge.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{badge.description}</p>
                  <p className="text-[11px] font-mono text-sky-400 pt-1 border-t border-slate-800/80">
                    Goal: {badge.criterion}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Certificate Generator */}
          <div className="rounded-lg border border-sky-500/40 bg-[#0B111F] p-6 space-y-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-sky-400">
                Downloadable Completion Certificate
              </div>
              <h3 className="mt-1 text-lg font-bold text-slate-100">
                Generate Your Space Explorer Certificate
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Enter your name below to export a high-resolution PNG certificate recording your exploration milestones.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <input
                type="text"
                value={explorerName}
                onChange={(e) => setExplorerName(e.target.value)}
                placeholder="Enter explorer or student name"
                aria-label="Explorer name on certificate"
                className="flex-1 rounded-md border border-slate-700 bg-[#07090E] px-3.5 py-2.5 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleDownloadCertificate}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Certificate PNG</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Printable Classroom Worksheet (hidden on screen via print rules, rendered cleanly when printing) */}
      <section className="hidden print:block p-6 text-black space-y-6">
        <h1 className="text-2xl font-bold">
          NASA&apos;s Forgotten Space Machines — Student Study Worksheet
        </h1>
        <p className="text-sm">
          Name: ______________________________ &nbsp;&nbsp; Date: ______________
        </p>
        <div className="space-y-4 text-sm">
          <h2 className="font-bold text-base">Part 1: Quick Questions</h2>
          {QUIZ_QUESTIONS.slice(0, 5).map((q, i) => (
            <div key={q.id} className="space-y-1">
              <p className="font-semibold">
                {i + 1}. {q.question}
              </p>
              <p className="text-xs">Answer: ________________________________________</p>
            </div>
          ))}
          <h2 className="font-bold text-base pt-2">Part 2: Key Vocabulary</h2>
          {GLOSSARY_TERMS.slice(0, 6).map((g) => (
            <p key={g.term} className="text-xs">
              <strong>{g.term}:</strong> {g.definition}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
