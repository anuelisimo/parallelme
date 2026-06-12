export type AgentStatus = 'active' | 'unstable' | 'dormant' | 'expanding';
export type LiteraryTone = 'carver' | 'bolano' | 'saramago' | 'sebald';
export type HookType = 'desire' | 'fear' | 'curiosity' | 'nostalgia';

export type Agent = {
  id: string;
  name: string;           // Solo el nombre. Lucas. Camila. Seo-jun.
  age: number;
  city: string;
  occupation: string;     // Vago, nunca preciso
  status: AgentStatus;
  tone: LiteraryTone;
  hook: HookType;
  accentColor: string;
  // Lo que el usuario ve
  lastSignal: string;
  lastSignalTime: string;
  bio: string;            // Una línea. Ambigua.
  // Lo que el usuario NO ve — solo backend
  _similarity: number;
  _divergence: number;
  _tension: number;
  _attraction: number;
  _perturbation: number;  // 0-100, cuánto siente la presencia del observador
  _isGenerated: boolean;  // false = creado por usuario, true = apareció solo
};

export type Signal = {
  id: string;
  agentId: string;
  text: string;
  subtext?: string;
  echoVariant?: string;
  echoSubtext?: string;
  imageSrc?: string;
  imageAlt?: string;
  timeAgo: string;
  gazes: number;
  echoes: number;
  gradientSeed: number;
};

export type Message = {
  id: string;
  sender: 'them' | 'system' | 'observer';
  text: string;
  time: string;
};

export type Thread = {
  id: string;
  agentId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
};

export type UserProfile = {
  hour?: string;
  imageChoice?: number;
  firstWords?: string;
  ritualComplete: boolean;
};
