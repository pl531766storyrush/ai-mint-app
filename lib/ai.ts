import { supabase } from '@/lib/supabase';
import { ToolType, HistoryItem } from '@/types';

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY as string | undefined;

interface GeminiPart {
  text: string;
}

interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
  finishReason?: string;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (!GEMINI_KEY) {
    throw new Error('Gemini API key not configured. Set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
  }

  const body: Record<string, unknown> = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.95,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  let res: Response;
  try {
    res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error. Check your internet connection and try again.');
  }

  let data: GeminiResponse;
  try {
    data = (await res.json()) as GeminiResponse;
  } catch {
    throw new Error(`Gemini API returned an invalid response (HTTP ${res.status}).`);
  }

  if (!res.ok) {
    const msg = data.error?.message ?? `Request failed (HTTP ${res.status})`;
    throw new Error(msg);
  }

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.map((p) => p.text).join('') ?? '';

  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return text.trim();
}

export async function generateChat(prompt: string): Promise<string> {
  return callGemini(
    prompt,
    'You are AI Mint, a helpful and friendly AI assistant. Be concise, clear, and engaging in your responses.'
  );
}

export async function generateText(prompt: string, kind: string): Promise<string> {
  return callGemini(
    prompt,
    `You are a professional writer. Write ${kind} based on the user's request. Be polished, well-structured, and engaging. Format with clear paragraphs.`
  );
}

export async function generateSearch(query: string): Promise<string> {
  return callGemini(
    query,
    'You are a research assistant. Provide a concise, factual answer with key points. If you are not certain, say so. Format with bullet points where helpful.'
  );
}

export async function generateImage(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt.slice(0, 400));
  const seed = Math.floor(Math.random() * 1_000_000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&seed=${seed}&nologo=true`;
}

export async function generateVideo(prompt: string): Promise<string> {
  // Gemini 2.5 Flash does not generate video; use a placeholder clip.
  void prompt;
  return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
}

function chunkText(text: string, maxLen = 190): string[] {
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > maxLen) {
      if (current) chunks.push(current.trim());
      if (s.length > maxLen) {
        for (let i = 0; i < s.length; i += maxLen) {
          chunks.push(s.slice(i, i + maxLen).trim());
        }
        current = '';
      } else {
        current = s;
      }
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

export async function generateVoice(text: string): Promise<string> {
  const chunks = chunkText(text);
  const urls = chunks.map((chunk) => {
    const encoded = encodeURIComponent(chunk);
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob`;
  });

  if (urls.length <= 1) return urls[0] ?? '';

  // For multi-chunk text, return a JSON-encoded array the player can iterate.
  return `json:${JSON.stringify(urls)}`;
}

export async function saveHistory(
  tool: ToolType,
  prompt: string,
  result: string,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const { error } = await supabase.from('history').insert({ tool, prompt, result, metadata });
  if (error) console.warn('Failed to save history:', error.message);
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const { data, error } = await supabase
    .from('history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as HistoryItem[];
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const { error } = await supabase.from('history').delete().eq('id', id);
  if (error) throw error;
}

export async function clearHistory(): Promise<void> {
  const { error } = await supabase.from('history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}
