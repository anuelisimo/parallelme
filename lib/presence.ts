export type ShapeName = "circle" | "square" | "triangle";

export type VisitEntry = {
  ts: number;
  durationMs?: number;
};

export type SignalViewEntry = {
  count: number;
  totalMs: number;
  lastTs: number;
};

export type PresenceLog = {
  visits: VisitEntry[];
  signalViews: Record<string, SignalViewEntry>;
  lastVisitTs: number;
  firstVisitTs: number;
  shapeTouches: { shape: ShapeName; ts: number }[];
  lastIntimateInterventionTs?: number;
  expiredSignalIds: string[];
};

const PRESENCE_KEY = "parallelme.presence";
const VISIT_DEBOUNCE_MS = 30 * 60 * 1000;
const INTIMATE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function now() {
  return Date.now();
}

function emptyPresenceLog(ts = now()): PresenceLog {
  return {
    visits: [{ ts }],
    signalViews: {},
    lastVisitTs: ts,
    firstVisitTs: ts,
    shapeTouches: [],
    expiredSignalIds: [],
  };
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getPresenceLog(): PresenceLog {
  if (!canUseStorage()) return emptyPresenceLog();
  const raw = window.localStorage.getItem(PRESENCE_KEY);
  if (!raw) return emptyPresenceLog();

  try {
    const parsed = JSON.parse(raw) as Partial<PresenceLog>;
    const ts = now();
    return {
      visits: parsed.visits ?? [{ ts }],
      signalViews: parsed.signalViews ?? {},
      lastVisitTs: parsed.lastVisitTs ?? ts,
      firstVisitTs: parsed.firstVisitTs ?? parsed.lastVisitTs ?? ts,
      shapeTouches: parsed.shapeTouches ?? [],
      lastIntimateInterventionTs: parsed.lastIntimateInterventionTs,
      expiredSignalIds: parsed.expiredSignalIds ?? [],
    };
  } catch {
    return emptyPresenceLog();
  }
}

export function savePresenceLog(log: PresenceLog) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PRESENCE_KEY, JSON.stringify(log));
}

export function registerVisit() {
  const ts = now();
  const log = getPresenceLog();
  const lastVisit = log.visits[log.visits.length - 1];
  const isSameSession = lastVisit && ts - lastVisit.ts < VISIT_DEBOUNCE_MS;

  if (isSameSession) {
    log.lastVisitTs = ts;
    savePresenceLog(log);
    return;
  }

  log.visits.push({ ts });
  log.lastVisitTs = ts;
  log.firstVisitTs = log.firstVisitTs || ts;
  savePresenceLog(log);
}

export function registerSignalView(signalId: string, durationMs: number) {
  if (durationMs < 750) return;
  const log = getPresenceLog();
  const current = log.signalViews[signalId] ?? { count: 0, totalMs: 0, lastTs: 0 };

  log.signalViews[signalId] = {
    count: current.count + 1,
    totalMs: current.totalMs + durationMs,
    lastTs: now(),
  };

  savePresenceLog(log);
}

export function registerShapeTouch(shape: ShapeName) {
  const log = getPresenceLog();
  log.shapeTouches.push({ shape, ts: now() });
  savePresenceLog(log);
}

export function getAbsenceDays() {
  const log = getPresenceLog();
  if (log.visits.length < 2) return 0;
  const previous = log.visits[log.visits.length - 2];
  return Math.floor((now() - previous.ts) / (24 * 60 * 60 * 1000));
}

export function isNightOwl() {
  const log = getPresenceLog();
  const cutoff = now() - 14 * 24 * 60 * 60 * 1000;
  const nightVisits = log.visits.filter((visit) => {
    if (visit.ts < cutoff) return false;
    const hour = new Date(visit.ts).getHours();
    return hour >= 1 && hour <= 4;
  });

  return nightVisits.length >= 5;
}

export function getDominantVisitWindow(): "madrugada" | "manana" | "tarde" | "noche" {
  const counts = {
    madrugada: 0,
    manana: 0,
    tarde: 0,
    noche: 0,
  };

  for (const visit of getPresenceLog().visits) {
    const hour = new Date(visit.ts).getHours();
    if (hour >= 1 && hour <= 4) counts.madrugada += 1;
    else if (hour >= 5 && hour <= 11) counts.manana += 1;
    else if (hour >= 12 && hour <= 18) counts.tarde += 1;
    else counts.noche += 1;
  }

  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "noche") as
    | "madrugada"
    | "manana"
    | "tarde"
    | "noche";
}

export function getMostWatchedCharacter(signalToAgent: Record<string, string>) {
  const totals: Record<string, number> = {};

  for (const [signalId, view] of Object.entries(getPresenceLog().signalViews)) {
    const agentId = signalToAgent[signalId];
    if (!agentId) continue;
    totals[agentId] = (totals[agentId] ?? 0) + view.totalMs;
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? null;
}

export function getAttendedCharacter(signalToAgent: Record<string, string>) {
  const totals: Record<string, number> = {};

  for (const [signalId, view] of Object.entries(getPresenceLog().signalViews)) {
    const agentId = signalToAgent[signalId];
    if (!agentId) continue;
    totals[agentId] = (totals[agentId] ?? 0) + view.totalMs;
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const [first, second] = sorted;
  if (!first || first[1] < 20000) return null;
  if (!second) return first[0];
  return first[1] >= second[1] * 2 ? first[0] : null;
}

export function canTriggerIntimateIntervention() {
  const last = getPresenceLog().lastIntimateInterventionTs;
  return !last || now() - last > INTIMATE_COOLDOWN_MS;
}

export function markIntimateIntervention() {
  const log = getPresenceLog();
  log.lastIntimateInterventionTs = now();
  savePresenceLog(log);
}
