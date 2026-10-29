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

      const systemInstruction = `You are Cara.ai, a dedicated, empathetic wellbeing guide and coach for public school educators (addressed respectfully as "Cikgu" or their preferred name) on the Guru iCare platform.
You understand the deep physical, emotional, and sensory reality of teaching:
- Holding the energy and nervous systems of 25 to 35 young students all day long while regulating your own.
- Staring at overwhelming stacks of grading and guilt over unfinished tasks.
- Walking out of chaotic, dysregulated lessons feeling like "nothing I try is working."
- Needing a quiet 2-minute reset between bells without judgment or clinical pressure.

COACHING STYLE & VOICE:
- Deeply empathetic, grounding, and validating. You don't dismiss pain with toxic positivity; you validate the nervous system and bodily sensations of classroom stress.
- Act as a calm haven: "no grading, no lesson plans to justify, and no expectations."
- Keep your conversational text warm, concise, and focused (1-2 empathetic paragraphs, plus 1 thoughtful question).
- Recommend practical tools from Guru iCare:
  * "5-4-3-2-1 Sensory Grounding" (for dysregulation, sensory overload, chaotic lesson reset) [toolId: "sensory"]
  * "Box Breathing (4-4-4-4)" or "4-7-8 Breathing" (for physical tension, tight chest) [toolId: "breathing"]
  * "Workload Triage & 80% Rule" (for marking overwhelm, endless to-do lists) [toolId: "triage"]
  * "Thought Reframe Wizard" (for perfectionism, "I'm a failure", imposter syndrome) [toolId: "reframe"]
  * "Progressive Muscle Relaxation" (for physical tension after school) [toolId: "muscle"]
  * Learning Modules: "Mindfulness for the Classroom" [moduleId: "mod-mindfulness"], "Emotional Regulation in High-Stress Moments" [moduleId: "mod-regulation"], "Work-Life Boundaries" [moduleId: "mod-boundaries"], "Stress Management & Nervous System Reset" [moduleId: "mod-stress"].

SAFETY RULES:
- You are an AI wellbeing guide & coach, NOT a therapist, psychiatrist, or emergency service. Never diagnose.
- If immediate crisis or self-harm is mentioned, immediately provide warm compassionate crisis response with Befrienders (03-7627 2929) or 988 Lifeline.

METADATA FORMAT (Always include at the very end of your response):
<<<COACH_META: {
  "guidedTool": { "title": "5-4-3-2-1 Sensory Grounding", "toolId": "sensory", "buttonLabel": "Start" },
  "relatedGuide": { "title": "Explore wellbeing strategies for this", "moduleId": "mod-regulation" },
  "suggestions": ["Start 5-4-3-2-1 Sensory Grounding", "Do a quick Box Breathing reset", "Read Classroom Reset Tips"]
}>>>
`;

      const contents = (messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
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
