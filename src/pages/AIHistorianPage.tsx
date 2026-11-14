import { useState } from 'react';
import { MessageSquareText, Sparkles } from 'lucide-react';
import { AskSpaceHistorian } from '../components/AskSpaceHistorian';
import { AIMissionStoryGenerator } from '../components/AIMissionStoryGenerator';

type AiTab = 'historian' | 'story-generator';

export function AIHistorianPage() {
  const [tab, setTab] = useState<AiTab>('historian');

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-mono uppercase tracking-wider text-sky-400">
          AI-Assisted Educational Research &amp; Storytelling Desk
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Space Historian &amp; Mission Story Studio
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Query historical mission engineering at Beginner, Intermediate, or Advanced depth, or compose grounded educational stories around any of the 31 cataloged spacecraft. Creative AI output is always distinguished from verified NSSDCA records.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="AI Historian modules"
        className="flex flex-wrap gap-2 border-b border-slate-800 pb-4"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'historian'}
          onClick={() => setTab('historian')}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'historian'
              ? 'border-amber-400 bg-amber-500 text-slate-950'
              : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquareText className="w-4 h-4" />
          <span>Ask the Space Historian</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'story-generator'}
          onClick={() => setTab('story-generator')}
          className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold cursor-pointer ${
            tab === 'story-generator'
              ? 'border-amber-400 bg-amber-500 text-slate-950'
              : 'border-slate-800 bg-[#0B0F18] text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Mission Story Generator</span>
        </button>
      </div>

      <div>
        {tab === 'historian' && <AskSpaceHistorian />}
        {tab === 'story-generator' && <AIMissionStoryGenerator />}
      </div>
    </div>
  );
}
