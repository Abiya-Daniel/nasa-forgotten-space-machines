import { useState } from 'react';
import { Sparkles, Volume2, BookOpen, Copy, Check } from 'lucide-react';
import { EQUIPMENT_DATA } from '../data/equipmentData';
import { querySpaceAi, ExplainLevel, StoryTone } from '../services/aiService';
import { useExperience } from '../context/ExperienceContext';

export function AIMissionStoryGenerator() {
  const { explainLevel, setExplainLevel, startCustomNarration, unlockBadge } =
    useExperience();

  const [machineId, setMachineId] = useState(EQUIPMENT_DATA[0].id);
  const [tone, setTone] = useState<StoryTone>('documentary');
  const [focusPrompt, setFocusPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [storyNotice, setStoryNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedMachine =
    EQUIPMENT_DATA.find((e) => e.id === machineId) || EQUIPMENT_DATA[0];

  const handleGenerate = async () => {
    if (loading) return;
    setLoading(true);
    setCopied(false);

    const customFocus = focusPrompt.trim()
      ? `Focus specifically on: ${focusPrompt.trim()}.`
      : 'Tell the dramatic yet scientifically accurate story of launch, arrival, greatest discovery, and final resting state or ongoing journey.';

    const result = await querySpaceAi({
      mode: 'story-generator',
      question: customFocus,
      level: explainLevel,
      tone,
      machine: selectedMachine,
    });

    setGeneratedStory(result.answer);
    setStoryNotice(
      result.notice ||
        `AI-Generated Educational Narrative (${result.model || 'Gemini'}) · Creative storytelling grounded in NSSDCA ${selectedMachine.nssdcaId}`
    );
    setLoading(false);
    unlockBadge('badge-mission-historian');
  };

  const handleCopy = async () => {
    if (!generatedStory) return;
    try {
      await navigator.clipboard.writeText(generatedStory);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable in restricted context
    }
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
          <Sparkles className="w-4 h-4" />
          <span>AI Mission Story Generator · Creative Documentary Studio</span>
        </div>
        <h2 className="mt-1 text-2xl font-bold text-slate-100">
          Compose Custom Space Narratives From Real Mission Logs
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
          Choose any of the 31 cataloged spacecraft, pick a storytelling voice and reading level, and generate a short narrative grounded in documented NASA telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F18] p-5 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="story-machine-select"
              className="block text-xs font-mono text-amber-400"
            >
              1. Select Spacecraft
            </label>
            <select
              id="story-machine-select"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs sm:text-sm text-slate-100 cursor-pointer"
            >
              {EQUIPMENT_DATA.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.mission}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-mono text-amber-400">
              2. Narrative Perspective
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {(
                [
                  {
                    id: 'documentary',
                    label: 'NASA Documentary Narrator',
                    desc: 'Cinematic museum narration focused on science & legacy',
                  },
                  {
                    id: 'control-room',
                    label: 'Mission Control Flight Log',
                    desc: 'Told from the consoles of JPL & Houston engineers',
                  },
                  {
                    id: 'first-person',
                    label: 'First-Person Spacecraft Voice',
                    desc: 'Creative literary perspective ("I landed on...")',
                  },
                ] as { id: StoryTone; label: string; desc: string }[]
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`text-left rounded-lg border px-3 py-2.5 text-xs transition-colors cursor-pointer ${
                    tone === t.id
                      ? 'border-amber-400 bg-[#141D30] text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-mono text-amber-400">
              3. Reading Complexity
            </div>
            <div className="grid grid-cols-3 gap-1.5">
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
                  className={`rounded-md border px-2.5 py-2 text-xs font-semibold cursor-pointer ${
                    explainLevel === lvl.id
                      ? 'border-sky-400 bg-sky-950/60 text-white'
                      : 'border-slate-800 bg-[#07090E] text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="story-focus-input"
              className="block text-xs font-mono text-slate-400"
            >
              4. Optional Moment to Highlight
            </label>
            <input
              id="story-focus-input"
              type="text"
              value={focusPrompt}
              onChange={(e) => setFocusPrompt(e.target.value)}
              placeholder="e.g., landing day, hardest storm, or final signal..."
              className="w-full rounded-md border border-slate-700 bg-[#07090E] px-3 py-2 text-xs text-slate-100 placeholder-slate-500"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Composing Narrative...' : 'Generate Mission Story'}</span>
          </button>
        </div>

        {/* Output Reader */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0B0F18] p-6 space-y-4 min-h-[380px] flex flex-col justify-between">
          {generatedStory ? (
            <>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                      AI-Generated Story · {tone} · {explainLevel}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                      {selectedMachine.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        startCustomNarration(
                          `ai-story-${selectedMachine.id}`,
                          `${selectedMachine.name} — Generated Story`,
                          `${tone.toUpperCase()} (${explainLevel})`,
                          generatedStory
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs font-medium text-sky-300 hover:border-sky-400 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#07090E] px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                  {generatedStory}
                </div>
              </div>

              {storyNotice && (
                <div className="rounded-md border border-sky-500/30 bg-[#070B14] px-3.5 py-2.5 text-[11px] text-slate-300 flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{storyNotice}</span>
                </div>
              )}
            </>
          ) : (
            <div className="my-auto text-center space-y-3 py-12">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-100">
                Ready to Compose a Mission Narrative
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Selected spacecraft: <span className="text-white font-semibold">{selectedMachine.name}</span> ({selectedMachine.launchDate} · {selectedMachine.coordinates.region}). Choose your tone and reading level, then click &ldquo;Generate Mission Story.&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
