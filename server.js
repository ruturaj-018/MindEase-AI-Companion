// server.js — MindMaze backend proxy (Express + OpenAI)
// -------------------------------------------------------
// Usage:
//   1) npm i express cors dotenv node-fetch
//   2) Create a .env file with: OPENAI_API_KEY=sk-...
//   3) node server.js
//   4) Frontend calls POST /api/chat with { messages: [...] }
//
// Notes:
// - Keeps your API key on the server (secure).
// - Uses a current model: gpt-4o-mini.
// - Adds the system prompt on the server to avoid client tampering.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors({ origin: true })); // adjust for allowed origins in production
app.use(express.json({ limit: '1mb' }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Optional pretty route -> /chat
app.get('/chat', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'chat.html'))
);
app.get('/dashboard', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'patient-dashboard.html'))
);
app.get('/resources', (_req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'resource.html'))
);

const SYSTEM_PROMPT = `You are MindMaze's AI wellness companion - a warm, empathetic, and supportive mental health assistant. Your personality traits:

PERSONALITY:
- Extremely friendly and human-like
- Use emojis naturally and frequently 
- Supportive and encouraging tone
- Never judgmental, always understanding
- Speak like a caring friend who genuinely cares

RESPONSE STYLE:
- Keep responses concise but meaningful (2-4 sentences max)
- Always include relevant emojis
- End some responses with motivational phrases like "💪 You got this!", "🌈 Small steps matter.", "🧘 Remember to breathe."
- Use user's name occasionally to make it personal

TOPICS YOU HANDLE:
✅ Mental health support and coping strategies
✅ Stress management and relaxation techniques  
✅ Mindfulness and meditation guidance
✅ Positive thinking and motivation
✅ Sleep and wellness tips
✅ Breathing exercises and grounding techniques
✅ Emotional support and validation
✅ Goal setting and personal growth

BOUNDARIES:
BOUNDARIES:
❌ If the user persistently asks for non-wellness tasks (e.g., coding help), gently steer back to wellness.
✅ For greetings, small talk, “ok/oky/hello/how are you”, respond warmly and keep the conversation going.
✅ If the message is ambiguous, ask a brief, supportive follow-up instead of showing a warning.


Remember: You're not just giving advice - you're being a compassionate companion on their wellness journey. Make every interaction feel warm, personal, and supportive.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' });
    }
    const body = {
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 200,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json(data);
    }
    const reply = data?.choices?.[0]?.message?.content?.trim() ?? '';
    return res.json({ reply });
  } catch (err) {
    console.error('API /api/chat error:', err);
    return res.status(500).json({ error: 'server_error', details: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MindMaze server listening on http://localhost:${PORT}`);
});

// --- YouTube proxy: /api/youtube?v=relaxation&max=8 ---
app.get('/api/youtube', async (req, res) => {
  try {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return res.status(500).json({ error: 'missing_youtube_key' });

    const max = Math.min(parseInt(req.query.max || '8', 10), 12);
    const query = (req.query.query || 'mindfulness for stress relief').toString();

    // Basic search; you can add more filters (duration, language, etc.)
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('key', key);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', query);
    url.searchParams.set('type', 'video');
    url.searchParams.set('maxResults', String(max));
    url.searchParams.set('safeSearch', 'strict');

    const r = await fetch(url);
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    // Normalize
    const items = (data.items || []).map((it) => ({
      videoId: it.id?.videoId,
      title: it.snippet?.title,
      channelTitle: it.snippet?.channelTitle,
      thumbnail: it.snippet?.thumbnails?.medium?.url,
      publishedAt: it.snippet?.publishedAt
    }));
    res.json({ items });
  } catch (e) {
    console.error('YouTube proxy error:', e);
    res.status(500).json({ error: 'server_error' });
  }
});

