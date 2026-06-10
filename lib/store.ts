import { create } from "zustand";
import { agents as initialAgents } from "./mock";
import { Agent, UserProfile } from "./types";
import { Lang } from "./i18n";

interface AppStore {
  agents: Agent[];
  userProfile: UserProfile;
  startedAt?: number;
  following: string[];
  viewCounts: Record<string, number>;
  glitchSeen: boolean;
  lang: Lang;

  setLang: (lang: Lang) => void;
  setStartedAt: (startedAt: number) => void;
  followAgent: (id: string) => void;
  recordView: (id: string) => void;
  updateRitual: (update: Partial<UserProfile>) => void;
  addUserAgent: (agent: Omit<Agent, "id" | "_isGenerated" | "_similarity" | "_divergence" | "_tension" | "_attraction" | "_perturbation">) => void;
  triggerGlitch: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  agents: initialAgents,
  userProfile: { ritualComplete: false },
  startedAt: undefined,
  following: [],
  viewCounts: {},
  glitchSeen: false,
  lang: 'es',

  setLang: (lang) => set({ lang }),
  setStartedAt: (startedAt) => set({ startedAt }),

  followAgent: (id) => set((s) => ({
    following: s.following.includes(id)
      ? s.following.filter((f) => f !== id)
      : [...s.following, id],
  })),

  recordView: (id) => set((s) => ({
    viewCounts: { ...s.viewCounts, [id]: (s.viewCounts[id] || 0) + 1 },
    agents: s.agents.map((a) =>
      a.id === id
        ? { ...a, _perturbation: Math.min(100, (a._perturbation || 0) + 8) }
        : a
    ),
  })),

  updateRitual: (update) => set((s) => ({
    userProfile: { ...s.userProfile, ...update },
  })),

  addUserAgent: (agentData) => set((s) => ({
    agents: [
      ...s.agents,
      {
        ...agentData,
        id: `user-${Date.now()}`,
        _isGenerated: false,
        _similarity: Math.floor(Math.random() * 20) + 60,
        _divergence: Math.floor(Math.random() * 30) + 10,
        _tension: Math.floor(Math.random() * 40) + 20,
        _attraction: Math.floor(Math.random() * 30) + 40,
        _perturbation: 0,
      },
    ],
  })),

  triggerGlitch: () => set({ glitchSeen: true }),
}));
