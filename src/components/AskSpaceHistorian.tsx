import { useState } from 'react';
import { Send, MessageSquareText, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { querySpaceAi, ExplainLevel } from '../services/aiService';
import { useExperience } from '../context/ExperienceContext';

interface ChatTurn {
  id: string;
  role: 'user' | 'historian';
  text: string;
  level: ExplainLevel;
  machineName?: string;
  notice?: string;
  isFallback?: boolean;
}

const STARTER_QUESTIONS = [
  'Why was Opportunity left behind on Mars instead of brought back to Earth?',
  'How does Voyager 1 still communicate from more than 25 billion km away?',
  'Why could InSight not blow Martian dust off its own solar panels?',
  'What did Apollo 15’s Genesis Rock teach scientists about the Moon?',
  'Which forgotten lunar machine was rediscovered by laser 39 years later?',
];

export function AskSpaceHistorian() {
  const { explainLevel, setExplainLevel, startCustomNarration, unlockBadge } =
    useExperience();

  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: 'welcome',
      role: 'historian',
      level: explainLevel,
      text: 'Welcome to the Digital Space Museum Archive Desk. Ask any question about spacecraft left behind on the Moon, Mars, or in deep space, or pick a reading level above to tailor explanations from Beginner to Advanced.',
      notice:
        'AI Historian answers are grounded in NASA NSSDCA records. If no live Gemini key is configured on the server, verified local archive briefs are displayed transparently.',
    },
  ]);

  const selectedMachine =
    EQUIPMENT_DATA.find((e) => e.id === selectedMachineId) || null;

  const submitQuestion = async (rawQ: string) => {
    const clean = rawQ.trim();
    if (!clean || loading) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
      level: explainLevel,
      machineName: selectedMachine?.name,
    };

    setTurns((prev) => [...prev, userTurn]);
    setQuestion('');
    setLoading(true);

    const result = await querySpaceAi({
      mode: 'historian',
      question: clean,
      level: explainLevel,
      machine: selectedMachine,
    });

    const aiTurn: ChatTurn = {
      id: `a-${Date.now()}`,
      role: 'historian',
      text: result.answer,
      level: explainLevel,
      machineName: selectedMachine?.name,
      notice:
        result.notice ||
        (result.model
          ? `AI Historian Response (${result.model}) · Grounded in NSSDCA data`
          : undefined),
      isFallback: result.isFallback,
    };

    setTurns((prev) => [...prev, aiTurn]);
    setLoading(false);
    unlockBadge('badge-mission-historian');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <MessageSquareText className="w-4 h-4" />
            <span>Ask the Space Historian · Adaptive Reading Levels</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-100">
            Investigate Space History &amp; Engineering Decisions
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Ask questions about any mission, switch explanation depth between Beginner, Intermediate, and Advanced, or focus the historian on a specific spacecraft.
          </p>
        </div>

        {/* #20 Explain Like I'm a Beginner / Intermediate / Advanced */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            Explanation Depth
          </div>
          <div className="inline-flex rounded-lg border border-slate-800 bg-[#0B0F18] p-1">
            {(
              [
                { id: 'beginner', label: 'Beginner' },
                { id: 'intermediate', label: 'Intermediate' },
                { id: 'advanced', label: 'Advanced' },
              ] as { id: ExplainLevel; label: string }[]
            ).map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setExplainLevel(lvl.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  explainLevel === lvl.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grounded Context & Starter Prompts */}
      <div className="rounded-xl border border-slate-800 bg-[#0B0F18] p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label
              htmlFor="historian-machine-select"
              className="block text-xs font-mono text-sky-400"
            >
              Optional Machine Context ({EQUIPMENT_DATA.length} Spacecraft)
            </label>
            <select
              id="historian-machine-select"
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs text-slate-200 cursor-pointer"
            >
              <option value="">General NASA Space Machines Archive</option>
              {EQUIPMENT_DATA.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.mission})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-7 flex flex-wrap gap-1.5">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => submitQuestion(q)}
                disabled={loading}
                className="rounded-md border border-slate-800 bg-[#07090E] px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-sky-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Feed */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto rounded-lg border border-slate-800/80 bg-[#07090E] p-4">
          {turns.map((turn) => (
            <div
              key={turn.id}
              className={`rounded-lg border p-4 space-y-2 ${
                turn.role === 'user'
                  ? 'border-sky-500/30 bg-[#0D1628] ml-auto max-w-2xl'
                  : 'border-slate-800 bg-[#0C111C] mr-auto max-w-3xl'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <span
                  className={
                    turn.role === 'user' ? 'text-sky-400' : 'text-amber-400'
                  }
                >
                  {turn.role === 'user' ? 'Explorer Question' : 'Space Historian'} ·{' '}
                  {turn.level.toUpperCase()}
                  {turn.machineName ? ` · ${turn.machineName}` : ''}
                </span>
                {turn.role === 'historian' && (
                  <button
                    type="button"
                    onClick={() =>
                      startCustomNarration(
                        turn.id,
                        'Space Historian Answer',
                        `Explanation (${turn.level})`,
                        turn.text
                      )
                    }
                    className="inline-flex items-center gap-1 rounded border border-slate-700 px-2 py-0.5 text-[11px] text-sky-300 hover:border-sky-400 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {turn.text}
              </p>

              {turn.notice && (
                <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/70">
                  {turn.isFallback ? (
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  )}
                  <span>{turn.notice}</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="rounded-lg border border-slate-800 bg-[#0C111C] p-4 max-w-md text-xs font-mono text-sky-300">
              Consulting NASA NSSDCA records &amp; composing {explainLevel} explanation...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitQuestion(question);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              selectedMachine
                ? `Ask about ${selectedMachine.name} (${explainLevel} mode)...`
                : `Ask the Space Historian anything (${explainLevel} mode)...`
            }
            aria-label="Ask the Space Historian"
            className="flex-1 rounded-md border border-slate-700 bg-[#07090E] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Thinking...' : 'Ask Historian'}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
