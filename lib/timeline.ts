import { agents, signals, threads } from "./mock";
import { Agent, Signal, Thread } from "./types";

export const STARTED_AT_KEY = "parallelme.startedAt";

export type TimelineEvent = {
  id: string;
  unlockAfterMinutes: number;
  signalIds: string[];
  threadIds?: string[];
};

const minute = 60 * 1000;

export const timeline: TimelineEvent[] = [
  { id: "arrival", unlockAfterMinutes: 0, signalIds: ["s1", "s2"] },
  { id: "drawer", unlockAfterMinutes: 8, signalIds: ["s3"], threadIds: ["t-lucas"] },
  { id: "plans", unlockAfterMinutes: 30, signalIds: ["s4"] },
  { id: "silence", unlockAfterMinutes: 90, signalIds: ["s5"], threadIds: ["t-observer"] },
  { id: "coast", unlockAfterMinutes: 180, signalIds: ["s7"], threadIds: ["t-ines"] },
  { id: "coffee", unlockAfterMinutes: 360, signalIds: ["s8"], threadIds: ["t-system"] },
  { id: "felix", unlockAfterMinutes: 720, signalIds: ["s6"] },
];

function getNow() {
  return Date.now();
}

export function getStartedAt() {
  if (typeof window === "undefined") return getNow();
  const stored = window.localStorage.getItem(STARTED_AT_KEY);
  if (stored) return Number(stored);
  const startedAt = getNow();
  window.localStorage.setItem(STARTED_AT_KEY, String(startedAt));
  return startedAt;
}

export function getElapsedMinutes(startedAt: number) {
  return Math.max(0, Math.floor((getNow() - startedAt) / minute));
}

export function getUnlockedEvents(startedAt: number) {
  const elapsed = getElapsedMinutes(startedAt);
  return timeline.filter((event) => event.unlockAfterMinutes <= elapsed);
}

export function getNextEvent(startedAt: number) {
  const elapsed = getElapsedMinutes(startedAt);
  return timeline.find((event) => event.unlockAfterMinutes > elapsed);
}

export function getUnlockedSignals(startedAt: number): Signal[] {
  const ids = new Set(getUnlockedEvents(startedAt).flatMap((event) => event.signalIds));
  return signals.filter((signal) => ids.has(signal.id));
}

export function getUnlockedThreads(startedAt: number): Thread[] {
  const ids = new Set(getUnlockedEvents(startedAt).flatMap((event) => event.threadIds ?? []));
  return threads.filter((thread) => ids.has(thread.id));
}

export function getVisibleAgents(startedAt: number, currentAgents: Agent[]) {
  const visibleSignals = getUnlockedSignals(startedAt);
  const visibleIds = new Set(visibleSignals.map((signal) => signal.agentId));
  return currentAgents
    .filter((agent) => visibleIds.has(agent.id))
    .map((agent) => {
      const latestSignal = [...visibleSignals].reverse().find((signal) => signal.agentId === agent.id);
      if (!latestSignal) return agent;
      return {
        ...agent,
        lastSignal: latestSignal.subtext ? `${latestSignal.text} ${latestSignal.subtext}` : latestSignal.text,
        lastSignalTime: latestSignal.timeAgo,
      };
    });
}

export function resolveSignalAgent(signal: Signal, currentAgents: Agent[]) {
  return currentAgents.find((agent) => agent.id === signal.agentId) ?? agents.find((agent) => agent.id === signal.agentId);
}
