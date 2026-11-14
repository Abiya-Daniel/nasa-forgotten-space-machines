import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MODEL_NAME = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

interface AiRequestBody {
  mode?: 'historian' | 'explain' | 'story-generator' | 'ask-machine';
  question?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  tone?: 'documentary' | 'control-room' | 'first-person';
  machineContext?: {
    id?: string;
    name?: string;
    mission?: string;
    body?: string;
    status?: string;
    launchDate?: string;
    landingDate?: string;
    endDate?: string;
    nssdcaId?: string;
    region?: string;
    powerSource?: string;
    missionPurpose?: string;
    whyLeftBehind?: string;
    scientificValue?: string;
    achievements?: string[];
  };
  topicText?: string;
}

function buildSystemInstruction(body: AiRequestBody): string {
  const levelGuide =
    body.level === 'beginner'
      ? 'Use clear, vivid language suitable for a 10-14 year old student or general visitor, defining technical terms briefly.'
      : body.level === 'advanced'
        ? 'Use rigorous aerospace engineering and planetary science depth (propulsion, telemetry bands, instrumentation physics, orbital mechanics) while remaining readable.'
        : 'Use engaging museum-documentary clarity balanced for high-school students and curious adults.';

  const safetyRules = [
    'You are the Space Historian & Engineering Curator for the educational platform "NASA\'s Forgotten Space Machines".',
    'STRICT SCIENTIFIC HONESTY: Never fabricate live spacecraft telemetry, fake radio transmissions, or invented mission failures.',
    'Explicitly distinguish verified NASA/ESA/Soviet facts from historical uncertainties or creative storytelling.',
    'Do not describe active missions (Voyager 1, Voyager 2, Curiosity, Perseverance, New Horizons, LRO, Hubble) as "abandoned"—describe them accurately as active or travelling.',
    levelGuide,
  ].join(' ');

  if (body.mode === 'story-generator') {
    const toneDesc =
      body.tone === 'control-room'
        ? 'Write a tense, historically grounded Mission Control room chronicle (with clear label that dramatic dialogue/pacing is creative reconstruction).'
        : body.tone === 'first-person'
          ? 'Write a thoughtful, emotionally resonant first-person reflection from the spacecraft\'s perspective grounded strictly in its real achievements and physical location.'
          : 'Write a cinematic NASA documentary narrative voiceover with clear chapter beats.';
    return `${safetyRules} ${toneDesc} Keep it concise (220-320 words), accurate to the provided machine record, and end with a 1-sentence verified legacy note.`;
  }

  if (body.mode === 'ask-machine') {
    return `${safetyRules} Answer the visitor's question in the persona of the specified spacecraft ("I..." voice) while staying 100% faithful to the supplied mission dossier. Include concrete facts (launch year, instruments, discoveries, current state) and note if something cannot be verified directly.`;
  }

  if (body.mode === 'explain') {
    return `${safetyRules} Rewrite and explain the provided spacecraft concept or mission event specifically at the "${body.level || 'beginner'}" level in 2 short paragraphs plus 3 crisp bullet takeaways.`;
  }

  return `${safetyRules} Answer the user's question concisely (under 240 words unless deep technical detail is requested), citing relevant NSSDCA IDs or mission names when applicable.`;
}

function buildUserPrompt(body: AiRequestBody): string {
  const ctx = body.machineContext;
  const ctxBlock = ctx
    ? [
        `GROUNDED MACHINE RECORD:`,
        `- Name: ${ctx.name || 'Unknown'}`,
        `- Mission: ${ctx.mission || 'Unknown'}`,
        `- World/Region: ${ctx.body || ''} (${ctx.region || ''})`,
        `- Status: ${ctx.status || 'Unknown'}`,
        `- NSSDCA ID: ${ctx.nssdcaId || 'N/A'}`,
        `- Launch: ${ctx.launchDate || 'N/A'} | Arrival: ${ctx.landingDate || 'N/A'}${ctx.endDate ? ` | End: ${ctx.endDate}` : ''}`,
        `- Power: ${ctx.powerSource || 'N/A'}`,
        `- Purpose: ${ctx.missionPurpose || ''}`,
        `- Why Left / Status Context: ${ctx.whyLeftBehind || ''}`,
        `- Scientific Value: ${ctx.scientificValue || ''}`,
        ctx.achievements?.length ? `- Key Achievements: ${ctx.achievements.join('; ')}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  if (body.mode === 'story-generator') {
    return `${ctxBlock}\n\nGenerate a ${body.tone || 'documentary'} mission narrative for ${ctx?.name || body.question || 'this spacecraft'} at the ${body.level || 'intermediate'} level.`;
  }

  if (body.mode === 'explain') {
    return `${ctxBlock}\n\nConcept / Topic to explain at ${body.level || 'beginner'} level:\n${body.topicText || body.question || ''}`;
  }

  if (body.mode === 'ask-machine') {
    return `${ctxBlock}\n\nVisitor question to ${ctx?.name || 'spacecraft'}: "${body.question || 'What was your greatest discovery?'}"`;
  }

  return `${ctxBlock ? `${ctxBlock}\n\n` : ''}Visitor Question: ${body.question || ''}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    const aiReady = Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
    );
    res.json({ ok: true, model: MODEL_NAME, aiConfigured: aiReady });
  });

  app.post('/api/ai/ask', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as AiRequestBody;
      const questionText = (body.question || body.topicText || '').trim();
      if (!questionText && body.mode !== 'story-generator') {
        res.status(400).json({ error: 'Please provide a question or topic.' });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(503).json({
          error: 'GEMINI_API_KEY_NOT_CONFIGURED',
          message:
            'Server-side Gemini API key is not configured yet. Configure GEMINI_API_KEY in AI Studio Secrets to enable live AI Historian responses.',
        });
        return;
      }

      const systemInstruction = buildSystemInstruction(body);
      const userPrompt = buildUserPrompt(body);

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: userPrompt,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const answer = response.text?.trim() || '';
      if (!answer) {
        res.status(502).json({
          error: 'EMPTY_RESPONSE',
          message: 'The model returned an empty response. Please try rephrasing your question.',
        });
        return;
      }

      res.json({
        answer,
        model: MODEL_NAME,
        mode: body.mode || 'historian',
        groundedIn: body.machineContext?.name || 'NASA Space Machines Archive',
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown Gemini API error';
      console.error('Gemini API error:', msg);
      res.status(500).json({
        error: 'AI_REQUEST_FAILED',
        message: 'Unable to reach the Space Historian AI service right now. Please try again shortly.',
      });
    }
  });

  const distDir = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  const shouldServeStatic =
    (process.env.NODE_ENV === 'production' ||
      process.env.npm_lifecycle_event === 'start') &&
    fs.existsSync(indexHtmlPath);

  if (shouldServeStatic) {
    app.use(express.static(distDir));
    app.use((_req: Request, res: Response) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
