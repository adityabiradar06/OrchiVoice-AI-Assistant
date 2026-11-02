import express from 'express';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { answerQuestion, streamQuestion } from './knowledge.js';

const app = express();
const projectRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const port = Number(process.env.PORT || 8789);
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'blob:'], mediaSrc: ["'self'", 'blob:'], connectSrc: ["'self'"], frameSrc: ["'self'"], objectSrc: ["'none'"], baseUri: ["'self'"],
  } },
}));
app.use(express.json({ limit: '24kb' }));
app.use('/api/', rateLimit({ windowMs: 60_000, limit: 25, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', assistant: 'Orchid AI' }));
app.post('/api/speech', async (req, res) => {
  const { text, language, speed = 1 } = req.body || {};
  if (typeof text !== 'string' || !text.trim() || text.length > 1600) return res.status(400).json({ error: 'Speech text must contain 1 to 1,600 characters.' });
  if (!['en', 'hi', 'mr'].includes(language)) return res.status(400).json({ error: 'Language must be en, hi, or mr.' });
  if (typeof speed !== 'number' || speed < 0.85 || speed > 1.35) return res.status(400).json({ error: 'Speech speed must be between 0.85 and 1.35.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Server speech generation is not configured.' });
  const pronunciationStyle = {
    en: 'Speak in a natural, neutral Indian English accent, as a clear and friendly college assistant in India. Keep the rhythm conversational and the pronunciation familiar to Indian English speakers; avoid an exaggerated accent.',
    hi: 'Speak in natural Hindi with clear Indian Hindi pronunciation',
    mr: 'Speak in natural Marathi with clear Indian Marathi pronunciation',
  }[language];
  const pacingStyle = speed >= 1.15
    ? 'Speak at a brisk pace, about 20 percent faster than a normal conversational rate, while keeping every word clear and natural.'
    : 'Speak at a natural, steady conversational pace.';

  try {
    const model = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-lite-tts';
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        model,
        input: [{
          type: 'user_input',
          content: [{
            type: 'text',
            text: text.trim(),
            annotations: [{ type: 'speech_metadata', style: `Warm, clear college receptionist; ${pronunciationStyle}. ${pacingStyle} Read the transcript verbatim without translating or adding words.` }],
          }],
        }],
        response_format: { type: 'audio' },
        generation_config: { speech_config: [{ voice: process.env.GEMINI_TTS_VOICE || 'Iapetus' }] },
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Gemini speech request failed:', response.status, detail.slice(0, 500));
      return res.status(502).json({ error: 'The speech service could not generate audio.' });
    }
    const payload = await response.json();
    const audioData = payload.steps
      ?.filter((step) => step.type === 'model_output')
      .flatMap((step) => step.content || [])
      .filter((part) => part.type === 'audio' && typeof part.data === 'string')
      .at(-1)?.data;
    if (!audioData) return res.status(502).json({ error: 'The speech service returned no audio.' });
    res.set({ 'content-type': 'audio/wav', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
    res.send(Buffer.from(audioData, 'base64'));
  } catch (error) {
    console.error('Gemini speech generation failed:', error.message);
    if (!res.headersSent) res.status(502).json({ error: 'The speech service is temporarily unavailable.' });
  }
});
app.post('/api/chat/stream', async (req, res) => {
  const { question, history = [], language = 'en', audience = 'student', languagePinned = false } = req.body || {};
  if (typeof question !== 'string' || !question.trim() || question.length > 1200) return res.status(400).json({ error: 'Enter a question under 1,200 characters.' });
  if (!['en', 'hi', 'mr'].includes(language)) return res.status(400).json({ error: 'Language must be en, hi, or mr.' });
  if (!Array.isArray(history) || history.length > 20 || history.some((item) => !['user', 'assistant'].includes(item?.role) || typeof item?.content !== 'string')) return res.status(400).json({ error: 'Conversation history is invalid.' });

  const startedAt = performance.now();
  const requestId = randomUUID();
  const languageCode = language;
  console.info('[Orchid AI performance]', JSON.stringify({ metric: 'requestReceived', requestId, language: languageCode, questionCharacters: question.trim().length }));
  const controller = new AbortController();
  let disconnected = false;
  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    'x-accel-buffering': 'no',
  });
  res.flushHeaders?.();
  const send = (event, data) => {
    if (disconnected || res.destroyed) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  res.on('close', () => {
    if (!res.writableEnded) {
      disconnected = true;
      controller.abort();
    }
  });

  try {
    send('status', { state: 'thinking' });
    const result = await streamQuestion(
      question.trim(),
      history,
      languageCode,
      ['parent', 'student'].includes(audience) ? audience : 'student',
      (text) => send('delta', { text }),
      controller.signal,
      languagePinned === true,
    );
    const timings = { ...result.timings, requestMs: Math.round(performance.now() - startedAt) };
    send('done', { sources: result.sources, timings });
    console.info('[Orchid AI retrieval]', JSON.stringify({ requestId, language: languageCode, sourceCount: result.sources.length, sourceTopics: result.sources.map((source) => source.topic).slice(0, 4), matchedVerifiedSource: result.sources.length > 0 }));
    console.info('[Orchid AI performance]', JSON.stringify({ requestId, language: languageCode, ...timings }));
    if (!res.writableEnded) res.end();
  } catch (error) {
    if (!disconnected) {
      console.error('Streaming question failed:', error.message);
      send('error', { error: 'I could not complete that response. Please try again.' });
      res.end();
    }
  }
});
app.post('/api/chat', async (req, res) => {
  const { question, history = [], language = 'en', audience = 'student', languagePinned = false } = req.body || {};
  if (typeof question !== 'string' || !question.trim() || question.length > 1200) return res.status(400).json({ error: 'Enter a question under 1,200 characters.' });
  if (!['en', 'hi', 'mr'].includes(language)) return res.status(400).json({ error: 'Language must be en, hi, or mr.' });
  if (!Array.isArray(history) || history.length > 20 || history.some((item) => !['user', 'assistant'].includes(item?.role) || typeof item?.content !== 'string')) return res.status(400).json({ error: 'Conversation history is invalid.' });
  const requestId = randomUUID();
  const startedAt = performance.now();
  try {
    const result = await answerQuestion(question.trim(), history, language, ['parent', 'student'].includes(audience) ? audience : 'student', languagePinned === true);
    console.info('[Orchid AI retrieval]', JSON.stringify({ requestId, language, sourceCount: result.sources.length, sourceTopics: result.sources.map((source) => source.topic).slice(0, 4), matchedVerifiedSource: result.sources.length > 0 }));
    console.info('[Orchid AI performance]', JSON.stringify({ requestId, language, metric: 'requestComplete', requestMs: Math.round(performance.now() - startedAt) }));
    res.json(result);
  } catch (error) {
    console.error('Question handling failed:', error);
    res.status(503).json({ error: 'I could not reach the college information service. Please try again.' });
  }
});
app.get('/glass-button.html', (_req, res) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'");
  res.sendFile(path.join(projectRoot, 'dist', 'glass-button.html'));
});
app.use(express.static(path.join(projectRoot, 'dist')));
app.get('*', (_req, res) => res.sendFile(path.join(projectRoot, 'dist', 'index.html')));
app.listen(port, () => console.log(`Orchid AI API listening on http://localhost:${port}`));
