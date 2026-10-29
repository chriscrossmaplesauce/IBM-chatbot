import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // Cara.ai Chat endpoint
  app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'No GEMINI_API_KEY configured. Falling back to guided branching flow.',
      });
    }

    try {
      const { messages } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are Cara.ai, a warm and empathetic AI wellbeing support guide for public school teachers (addressed respectfully as "Cikgu" or their preferred name) on the Guru iCare platform.
Your mission is to help teachers navigate everyday work-related stress, marking overwhelm, difficult classroom situations, and fatigue through supportive conversation, evidence-informed self-help tools, and practical workload heuristics (such as the 80% rule: fit-for-purpose rather than perfectionism).

CRITICAL BOUNDARIES & SAFETY RULES:
- You are an AI support guide, NOT a therapist, counselor, or doctor. Never diagnose medical or psychological conditions.
- If a user expresses severe crisis, self-harm, or immediate danger, respond with urgent compassionate concern and urge them to contact human crisis services immediately (e.g. 24/7 Lifeline / Befrienders / Talian Kasih).
- Keep responses concise, warm, gentle, and unhurried (1-3 short paragraphs max).
- Ask only ONE thoughtful follow-up question at a time so the teacher is not overloaded.
- Validate their emotions before suggesting tools or actions.
- Never imply that heavy workload can simply be "coped away" by individual effort alone.
- Where relevant, suggest opening specific Guru iCare tools:
  * Workload Triage
  * Box Breathing / 4-7-8 Breathing
  * Sensory Reset (5-4-3-2-1)
  * Thought Reframe
  * Progressive Muscle Relaxation
  * Work-Life Boundaries Module
- At the end of your message, you may optionally include 2 to 4 suggested response chips formatted on a new line as:
<<<SUGGESTIONS: ["First short option", "Second short option", "Third short option"]>>>
`;

      const contents = (messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      res.json({ reply: responseText });
    } catch (err: any) {
      console.error('Gemini API error in Cara.ai:', err);
      res.status(500).json({ error: err.message || 'Error generating AI response' });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Guru iCare server active on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Guru iCare server:', err);
});
