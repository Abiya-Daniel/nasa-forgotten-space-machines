import { useState } from 'react';
import { Sparkles, Send, Volume2, BookOpen } from 'lucide-react';
import { EquipmentItem } from '../types/equipment';
import { querySpaceAi, ExplainLevel } from '../services/aiService';
import { useExperience } from '../context/ExperienceContext';

interface AskThisMachinePanelProps {
  item: EquipmentItem;
}

export function AskThisMachinePanel({ item }: AskThisMachinePanelProps) {
  const { explainLevel, setExplainLevel, startCustomNarration, unlockBadge } =
    useExperience();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const ask = async (mode: 'ask-machine' | 'explain', promptText: string) => {
    if (!promptText.trim() || loading) return;
    setLoading(true);
    const res = await querySpaceAi({
      mode,
      question: promptText.trim(),
      level: explainLevel,
      machine: item,
    });
    setAnswer(res.answer);
    setNotice(
      res.notice ||
        `AI Educational Mode (${res.model || 'Gemini'}) · Grounded in ${item.name} (${item.nssdcaId}) archive facts`
    );
    setLoading(false);
    unlockBadge('badge-mission-historian');
  };

  return (
    <div className="rounded-lg border border-sky-500/30 bg-[#0A101E] p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Ask This Machine &amp; Explain Level ({explainLevel})</span>
        </div>

        <div className="inline-flex rounded-md border border-slate-800 bg-[#07090E] p-0.5 text-[11px]">
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
              className={`rounded px-2 py-1 font-medium cursor-pointer ${
                explainLevel === lvl.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            ask(
              'explain',
              `Explain the mission, discoveries, and current resting state of ${item.name} clearly at a ${explainLevel} level.`
            )
          }
          className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-amber-500/20 cursor-pointer disabled:opacity-50"
        >
          Explain Like I&apos;m {explainLevel === 'beginner' ? 'a Beginner' : explainLevel}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            ask('ask-machine', 'What was the hardest challenge you faced during your mission?')
          }
          className="rounded-md border border-slate-700 bg-[#07090E] px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-sky-500 hover:text-white cursor-pointer disabled:opacity-50"
        >
          Hardest engineering challenge?
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            ask('ask-machine', 'Why are you still where you are today and what is your legacy?')
          }
          className="rounded-md border border-slate-700 bg-[#07090E] px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-sky-500 hover:text-white cursor-pointer disabled:opacity-50"
        >
          Why did you stay behind?
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask('ask-machine', question);
          setQuestion('');
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask ${item.name} a question...`}
          aria-label={`Ask ${item.name} a question`}
          className="flex-1 rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-sky-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? 'Replying...' : 'Ask Machine'}</span>
        </button>
      </form>

      {answer && (
        <div className="rounded-md border border-slate-800 bg-[#07090E] p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-amber-400">
            <span>{item.name} Response (Creative Simulation / Explanation)</span>
            <button
              type="button"
              onClick={() =>
                startCustomNarration(
                  `ask-${item.id}`,
                  item.name,
                  `Response (${explainLevel})`,
                  answer
                )
              }
              className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {answer}
          </p>
          {notice && (
            <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <BookOpen className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
