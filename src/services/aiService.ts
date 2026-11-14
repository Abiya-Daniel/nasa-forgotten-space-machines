import { EquipmentItem } from '../types/equipment';

export type ExplainLevel = 'beginner' | 'intermediate' | 'advanced';
export type StoryTone = 'documentary' | 'control-room' | 'first-person';

export interface AiQueryResult {
  ok: boolean;
  answer: string;
  model?: string;
  isFallback?: boolean;
  notice?: string;
}

function serializeMachine(item?: EquipmentItem | null) {
  if (!item) return undefined;
  return {
    id: item.id,
    name: item.name,
    mission: item.mission,
    body: item.body,
    status: item.status,
    launchDate: item.launchDate,
    landingDate: item.landingDate,
    endDate: item.endDate,
    nssdcaId: item.nssdcaId,
    region: item.coordinates.region,
    powerSource: item.powerSource,
    missionPurpose: item.missionPurpose,
    whyLeftBehind: item.whyLeftBehind,
    scientificValue: item.scientificValue,
    achievements: item.achievements,
  };
}

function buildArchiveFallback(
  mode: 'historian' | 'explain' | 'story-generator' | 'ask-machine',
  question: string,
  level: ExplainLevel,
  item?: EquipmentItem | null
): AiQueryResult {
  if (item) {
    if (mode === 'ask-machine') {
      return {
        ok: true,
        isFallback: true,
        notice:
          'Archive Fallback Mode (live Gemini API unavailable or unconfigured): Showing verified NSSDCA dossier facts.',
        answer: `[Verified Dossier Summary for ${item.name} — NSSDCA ${item.nssdcaId}]\n\nLaunched ${item.launchDate} for ${item.mission} (${item.coordinates.region}), my primary purpose was: ${item.missionPurpose}\n\nWhat happened / current state: ${item.whyLeftBehind}\n\nScientific legacy: ${item.scientificValue}`,
      };
    }
    if (mode === 'story-generator') {
      return {
        ok: true,
        isFallback: true,
        notice:
          'Archive Fallback Mode (live Gemini API unavailable or unconfigured): Showing grounded documentary brief.',
        answer: `MISSION BRIEF (${level.toUpperCase()}): ${item.name} (${item.mission}, NSSDCA ${item.nssdcaId}).\n\nLaunched on ${item.launchDate}, this spacecraft reached ${item.coordinates.region} (${item.landingDate}). ${item.missionPurpose}\n\nHighlights: ${item.achievements.join(' ')}\n\nVerified Legacy: ${item.scientificValue}`,
      };
    }
  }

  return {
    ok: true,
    isFallback: true,
    notice:
      'Archive Fallback Mode: Live Gemini AI responses require GEMINI_API_KEY in server secrets. Try browsing the Space History Archive or Machine Catalog for full verified records.',
    answer: `Archival Note (${level.toUpperCase()}): You asked "${question}". While the live AI Historian endpoint is currently offline or awaiting an API key, every spacecraft in this digital museum is cross-referenced with NASA NSSDCA catalog records. Use the Machine Catalog, Where Is It Now? Tracker, or Mission Autopsy Lab for exact dates, instruments, and verified scientific findings.`,
  };
}

export async function querySpaceAi(params: {
  mode: 'historian' | 'explain' | 'story-generator' | 'ask-machine';
  question: string;
  level?: ExplainLevel;
  tone?: StoryTone;
  machine?: EquipmentItem | null;
  topicText?: string;
}): Promise<AiQueryResult> {
  const level = params.level || 'intermediate';
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal ? AbortSignal.timeout(15000) : undefined,
      body: JSON.stringify({
        mode: params.mode,
        question: params.question,
        level,
        tone: params.tone,
        machineContext: serializeMachine(params.machine),
        topicText: params.topicText,
      }),
    });

    const data = (await res.json()) as {
      answer?: string;
      model?: string;
      error?: string;
      message?: string;
    };

    if (!res.ok || !data.answer) {
      return buildArchiveFallback(params.mode, params.question, level, params.machine);
    }

    return {
      ok: true,
      answer: data.answer,
      model: data.model,
      isFallback: false,
    };
  } catch {
    return buildArchiveFallback(params.mode, params.question, level, params.machine);
  }
}
