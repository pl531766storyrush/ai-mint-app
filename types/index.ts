export type Plan = 'free' | 'premium';

export type ToolType =
  | 'chat'
  | 'image'
  | 'video'
  | 'voice'
  | 'writer'
  | 'search';

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  plan: Plan;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  tool: ToolType;
  prompt: string;
  result: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  status: string;
  amount_paise: number;
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ToolDef {
  key: ToolType;
  title: string;
  description: string;
  icon: string;
  route: string;
  accent: string;
}
