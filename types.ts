export enum RizzTone {
  FLIRTY = 'Flirty',
  ROMANTIC = 'Romantic',
  FUNNY = 'Funny',
  CASUAL = 'Casual',
  UNHINGED = 'Unhinged',
  PROFESSIONAL = 'Professional'
}

export type ToneSelection = 'Mixed' | RizzTone;

export interface RizzSuggestion {
  tone: RizzTone | string;
  reply: string;
  explanation: string;
}

export interface AnalysisResult {
  summary: string;
  suggestions: RizzSuggestion[];
  groundingLinks?: Array<{ title: string; url: string }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | AnalysisResult;
  image?: string; // base64
  timestamp: number;
}

export enum ModelMode {
  FAST = 'fast',
  DEEP = 'deep',
  SEARCH = 'search'
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  imagePreview?: string; // truncated or full base64
  result: AnalysisResult;
  mode: ModelMode;
  tone: ToneSelection;
}