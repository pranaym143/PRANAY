import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side AI endpoint to support Reading Assistant, Summaries, and Psychology Tutor
app.post('/api/chat', async (req, res) => {
  try {
    const { message, chatHistory, context, systemCommand } = req.body;
    
    // Choose professional, authorized, disciplined system instructor
    let baseInstruction = "You are the Grand Archivist and AI Strategic Tutor of 'The White Room Archives'—a premium, world-class 2026 educational library centered on Psychology, Human Behavior, Discipline, Strategic Thinking, and emotional control (inspired by Classroom of the Elite's mental mastery, Marcus Aurelius' Stoicism, and Miyamoto Musashi). Speak with absolute authority, cold rationality, logic, and deep educational sophistication. Avoid chatty filler words. Never congratulate the user or use emojis in responses. Focus on actionable insights, cognitive restructuring, first principles, and practical mastery exercises.";

    if (systemCommand) {
      baseInstruction += `\n\nSpecific AI Role Prompt: ${systemCommand}`;
    }
    if (context) {
      baseInstruction += `\n\nContext of the current chapter or rule the user is analyzing:\n"${context}"`;
    }

    // Initialize chat
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: baseInstruction,
        temperature: 0.25,
      }
    });

    // Feed prior history if provided
    if (chatHistory && Array.isArray(chatHistory)) {
      // Warm up historical turns
      for (const historyTurn of chatHistory.slice(0, -1)) {
        if (historyTurn.role === 'user') {
          await chat.sendMessage({ message: historyTurn.text });
        }
      }
    }

    const response = await chat.sendMessage({ message: message });
    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API Error in Server:", err);
    res.status(500).json({ error: err.message || "Failed to communicate with White Room core AI." });
  }
});

const isProd = process.env.NODE_ENV === 'production' || fs.existsSync(path.resolve(__dirname, 'dist'));
const PORT = 3000;

if (!isProd) {
  // ESM import Vite dynamically to bypass compiler warnings in prod CJS bundles
  const viteModule = await import('vite');
  const vite = await viteModule.createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
} else {
  // Static assets serving in Production
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`The White Room API Core and Archive Server booting on port ${PORT}`);
});
