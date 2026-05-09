import { GoogleGenAI } from "@google/genai";
import type {
  GeminiStructuredResponse,
  Note,
  Task,
  Fact,
  Question,
} from "@/types";

const API_KEY_STORAGE_KEY = "voice_notes_gemini_api_key";

function getApiKey(): string {
  // Check localStorage first (user setting), then env variable
  const key =
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "Gemini API key not configured. Please add it in Settings or .env file.",
    );
  }
  return key;
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function getStoredApiKey(): string | null {
  return (
    localStorage.getItem(API_KEY_STORAGE_KEY) ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    null
  );
}

const STRUCTURING_PROMPT = `You are a cognitive offloading assistant. Your job is to take raw, unstructured speech transcription and organize it into a structured note.

The transcription may be messy: filler words, topic jumps, incomplete thoughts. Extract the meaning and structure it.

Respond ONLY with valid JSON in this exact format:
{
  "summary": "2-3 sentence summary of the main points",
  "tasks": [
    {
      "text": "Clear action item description",
      "deadline": "inferred deadline like '2024-03-15' or null if no deadline mentioned"
    }
  ],
  "facts": [
    {
      "text": "A key fact or piece of information stated",
      "confidence": 85
    }
  ],
  "questions": [
    {
      "text": "An open question the user asked or raised"
    }
  ]
}

Rules:
- Summary should capture the essence in 2-3 clear sentences
- Tasks: look for action words (need to, should, must, have to, don't forget). Infer deadlines from temporal references (tomorrow, next week, Monday, etc.)
- Facts: extract concrete pieces of information with confidence scores (0-100). Higher for explicitly stated facts, lower for inferred ones.
- Questions: identify questions the user asked but didn't answer themselves
- If a category has no items, return an empty array
- Respond with ONLY the JSON, no markdown formatting, no extra text`;

export async function structureNote(
  transcription: string,
): Promise<Pick<Note, "title" | "summary" | "tasks" | "facts" | "questions">> {
  const apiKey = getApiKey();
  const genAI = new GoogleGenAI({ apiKey });

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: `${STRUCTURING_PROMPT}\n\nTranscription:\n"""\n${transcription}\n"""`,
    config: {
      maxOutputTokens: 2048,
      temperature: 0.3,
    },
  });

  const text = response.text;
  console.log(text);

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  const jsonText = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const parsed: GeminiStructuredResponse = JSON.parse(jsonText);

  const title = generateTitle(parsed.summary, transcription);

  return {
    title,
    summary: parsed.summary,
    tasks: parsed.tasks.map((t) => ({
      id: crypto.randomUUID(),
      text: t.text,
      completed: false,
      deadline: t.deadline,
    })) as Task[],
    facts: parsed.facts.map((f) => ({
      id: crypto.randomUUID(),
      text: f.text,
      confidence: Math.min(100, Math.max(0, f.confidence)),
    })) as Fact[],
    questions: parsed.questions.map((q) => ({
      id: crypto.randomUUID(),
      text: q.text,
      answer: null,
    })) as Question[],
  };
}

function generateTitle(summary: string, transcription: string): string {
  const firstLine =
    summary.split(".")[0] || transcription.split(".")[0] || "Untitled Note";
  return firstLine.length > 60 ? firstLine.substring(0, 60) + "..." : firstLine;
}

export async function structureNoteWithFallback(
  transcription: string,
): Promise<Pick<Note, "title" | "summary" | "tasks" | "facts" | "questions">> {
  try {
    return await structureNote(transcription);
  } catch {
    const title = generateTitle("", transcription);
    return {
      title,
      summary: transcription,
      tasks: [],
      facts: [],
      questions: [],
    };
  }
}
