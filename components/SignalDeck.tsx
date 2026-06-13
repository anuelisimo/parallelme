"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CharacterMark from "@/components/CharacterMark";
import { useAppStore } from "@/lib/store";
import { Agent, Signal } from "@/lib/types";
import { getCharacterIdentity } from "@/lib/characterIdentity";
import { getNextEvent, getStartedAt, getUnlockedSignals, resolveSignalAgent } from "@/lib/timeline";
import { getAttendedCharacter, registerSignalView, registerVisit } from "@/lib/presence";

const statusDot: Record<string, string> = {
  active: "#3ec87a",
  unstable: "#d4607a",
  dormant: "#3a3a55",
  expanding: "#7c6ff0",
};

const atmosphereShapes = [
  { left: "14%", top: "18%", width: "34%", height: "46%", radius: 4, opacity: 0.04 },
  { left: "58%", top: "12%", width: "22%", height: "58%", radius: 999, opacity: 0.03 },
  { left: "22%", top: "62%", width: "52%", height: "1px", radius: 0, opacity: 0.07 },
];

type SignalEntry = {
  signal: Signal;
  agent: Agent;
};

type CharacterLine = {
  agent: Agent;
  signals: Signal[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SignalAtmosphere({ signal, agent, priority = false }: { signal: Signal; agent: Agent; priority?: boolean }) {
  const seed = signal.gradientSeed % 6;
  const accents = [
    ["#1b1638", "#101f32"],
    ["#2b1423", "#15112d"],
    ["#102936", "#19172a"],
    ["#182519", "#101d2e"],
    ["#2d250f", "#19122d"],
    ["#1f1232", "#0f2530"],
  ][seed];

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: `radial-gradient(circle at 30% 22%, ${agent.accentColor}33 0%, transparent 28%),
          radial-gradient(circle at 75% 70%, ${accents[1]}dd 0%, transparent 42%),
          linear-gradient(155deg, ${accents[0]} 0%, #08080d 58%, #050508 100%)`,
      }}
    >
      {signal.imageSrc && (
        <Image
          src={signal.imageSrc}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 760px) 100vw, 520px"
          style={{
            objectFit: "cover",
            opacity: 0.98,
            filter: "saturate(0.98) contrast(1.02) brightness(0.98)",
          }}
        />
      )}
      {atmosphereShapes.map((shape, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: shape.left,
            top: shape.top,
            width: shape.width,
            height: shape.height,
            borderRadius: shape.radius,
            opacity: shape.opacity,
            border: `1px solid ${agent.accentColor}`,
            background: index === 0 ? `${agent.accentColor}${signal.imageSrc ? "06" : "12"}` : "transparent",
            transform: `translateY(${seed * 3}px) rotate(${(seed - index) * 2}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 74%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 280 280' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E\")",
          opacity: signal.imageSrc ? 0.11 : 0.28,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: signal.imageSrc
            ? `linear-gradient(to bottom, rgba(8,8,13,0.18), rgba(8,8,13,0.02) 26%, rgba(8,8,13,0.1) 54%, rgba(8,8,13,0.5) 100%),
              linear-gradient(90deg, rgba(8,8,13,0.22), transparent 42%, rgba(8,8,13,0.08))`
            : "linear-gradient(to bottom, rgba(8,8,13,0.08), rgba(8,8,13,0.34) 48%, rgba(8,8,13,0.86))",
        }}
      />
    </div>
  );
}

function getSignalToAgentMap(visibleSignals: Signal[]) {
  return Object.fromEntries(visibleSignals.map((signal) => [signal.id, signal.agentId]));
}

function applyEcho(signal: Signal, attendedAgentId: string | null): Signal {
  if (!attendedAgentId || signal.agentId !== attendedAgentId || !signal.echoVariant) return signal;
  return {
    ...signal,
    text: signal.echoVariant,
    subtext: signal.echoSubtext ?? signal.subtext,
  };
}

function deckLines(allAgents: Agent[], startedAt?: number): CharacterLine[] {
  const visibleSignals = startedAt ? getUnlockedSignals(startedAt) : [];
  const attendedAgentId = getAttendedCharacter(getSignalToAgentMap(visibleSignals));
  const entries = [...visibleSignals]
    .reverse()
    .map((baseSignal) => {
      const signal = applyEcho(baseSignal, attendedAgentId);
      return {
        signal,
        agent: resolveSignalAgent(signal, allAgents),
      };
    })
    .filter((entry): entry is SignalEntry => Boolean(entry.agent));

  const lines = new Map<string, CharacterLine>();
  for (const { signal, agent } of entries) {
    const existing = lines.get(agent.id);
    if (existing) {
      existing.signals.push(signal);
    } else {
      lines.set(agent.id, { agent, signals: [signal] });
    }
  }

  return Array.from(lines.values());
}

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return target.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select";
}

export default function SignalDeck() {
  const allAgents = useAppStore((state) => state.agents);
  const startedAt = useAppStore((state) => state.startedAt);
  const setStartedAt = useAppStore((state) => state.setStartedAt);
  const recordView = useAppStore((state) => state.recordView);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [activeSignalByAgentId, setActiveSignalByAgentId] = useState<Record<string, number>>({});
  const [timelineTick, setTimelineTick] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const horizontalRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const recordedRef = useRef<Set<string>>(new Set());
  const lines = useMemo(() => deckLines(allAgents, startedAt), [allAgents, startedAt, timelineTick]);
  const nextEvent = useMemo(() => (startedAt ? getNextEvent(startedAt) : undefined), [startedAt, timelineTick]);
  const activeLine = lines[activeLineIndex];
  const activeSignalIndex = activeLine
    ? clamp(activeSignalByAgentId[activeLine.agent.id] ?? 0, 0, activeLine.signals.length - 1)
    : 0;
  const activeSignal = activeLine?.signals[activeSignalIndex];

  useEffect(() => {
    if (startedAt) return;
    setStartedAt(getStartedAt());
  }, [setStartedAt, startedAt]);

  useEffect(() => {
    registerVisit();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setTimelineTick((tick) => tick + 1), 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lines.length) {
      setActiveLineIndex(0);
      return;
    }

    setActiveLineIndex((index) => clamp(index, 0, lines.length - 1));
    setActiveSignalByAgentId((current) => {
      const next = { ...current };
      for (const line of lines) {
        next[line.agent.id] = clamp(next[line.agent.id] ?? 0, 0, line.signals.length - 1);
      }
      return next;
    });
  }, [lines]);

  useEffect(() => {
    if (!activeSignal) return;
    const started = Date.now();
    return () => {
      registerSignalView(activeSignal.id, Date.now() - started);
    };
  }, [activeSignal]);

  useEffect(() => {
    if (!activeLine || !activeSignal || recordedRef.current.has(activeSignal.id)) return;
    recordedRef.current.add(activeSignal.id);
    recordView(activeLine.agent.id);
  }, [activeLine, activeSignal, recordView]);

  const scrollToLine = useCallback((index: number) => {
    const container = containerRef.current;
    const nextIndex = clamp(index, 0, Math.max(lines.length - 1, 0));
    setActiveLineIndex(nextIndex);
    if (!container) return;
    container.scrollTo({
      top: nextIndex * Math.max(container.clientHeight, 1),
      behavior: "smooth",
    });
  }, [lines.length]);

  const scrollToSignal = useCallback((agentId: string, index: number) => {
    const line = lines.find((candidate) => candidate.agent.id === agentId);
    if (!line) return;

    const nextIndex = clamp(index, 0, line.signals.length - 1);
    setActiveSignalByAgentId((current) => ({ ...current, [agentId]: nextIndex }));

    const row = horizontalRefs.current[agentId];
    if (!row) return;
    row.scrollTo({
      left: nextIndex * Math.max(row.clientWidth, 1),
      behavior: "smooth",
    });
  }, [lines]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableElement(event.target)) return;
      if (!lines.length) return;

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        scrollToLine(activeLineIndex + (event.key === "ArrowDown" ? 1 : -1));
        return;
      }

      if (!activeLine) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const currentIndex = activeSignalByAgentId[activeLine.agent.id] ?? 0;
        scrollToSignal(activeLine.agent.id, currentIndex + (event.key === "ArrowRight" ? 1 : -1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLine, activeLineIndex, activeSignalByAgentId, lines.length, scrollToLine, scrollToSignal]);

  function handleVerticalScroll() {
    const container = containerRef.current;
    if (!container || !lines.length) return;
    const nextIndex = Math.round(container.scrollTop / Math.max(container.clientHeight, 1));
    setActiveLineIndex(clamp(nextIndex, 0, lines.length - 1));
  }

  function handleHorizontalScroll(agentId: string, signalCount: number, event: React.UIEvent<HTMLDivElement>) {
    const row = event.currentTarget;
    const nextIndex = Math.round(row.scrollLeft / Math.max(row.clientWidth, 1));
    setActiveSignalByAgentId((current) => ({
      ...current,
      [agentId]: clamp(nextIndex, 0, signalCount - 1),
    }));
  }

  return (
    <div style={{ position: "relative", minHeight: "calc(100svh - 80px)", background: "#08080d" }}>
      <div
        ref={containerRef}
        onScroll={handleVerticalScroll}
        style={{
          height: "calc(100svh - 80px)",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
      >
        {lines.map((line, lineIndex) => {
          const { agent, signals } = line;
          const identity = getCharacterIdentity(agent.id);
          const active = lineIndex === activeLineIndex;
          const lineSignalIndex = clamp(activeSignalByAgentId[agent.id] ?? 0, 0, signals.length - 1);
          const currentSignal = signals[lineSignalIndex];

          return (
            <article
              key={agent.id}
              style={{
                minHeight: "calc(100svh - 80px)",
                scrollSnapAlign: "start",
                position: "relative",
                overflow: "hidden",
                background: "#08080d",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  zIndex: 5,
                  inset: 10,
                  border: `1px solid ${agent.accentColor}${active ? "a8" : "55"}`,
                  boxShadow: `inset 0 0 0 1px rgba(8,8,13,0.65), 0 0 36px ${agent.accentColor}${active ? "18" : "0c"}`,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  zIndex: 6,
                  top: 20,
                  left: 20,
                  right: 20,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  pointerEvents: "none",
                }}
              >
                <Link
                  href={`/person/${agent.id}`}
                  style={{
                    minWidth: 0,
                    textDecoration: "none",
                    pointerEvents: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    maxWidth: "calc(100% - 76px)",
                    padding: "7px 10px 7px 7px",
                    border: `1px solid ${agent.accentColor}2e`,
                    background: "linear-gradient(90deg, rgba(8,8,13,0.68), rgba(8,8,13,0.26), rgba(8,8,13,0))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <CharacterMark agent={agent} size={42} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ color: "var(--text)", fontSize: 15, fontWeight: 600 }}>{agent.name}</span>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusDot[agent.status] }} />
                    </div>
                    <div style={{ color: "var(--ghost)", ...identity.metaStyle, fontSize: 11, marginTop: 3 }}>
                      {currentSignal?.chapter ?? `${agent.city} / ${currentSignal?.timeAgo ?? ""}`}
                    </div>
                  </div>
                </Link>

                <div
                  style={{
                    color: active ? agent.accentColor : "var(--whisper)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    lineHeight: 1.2,
                    textAlign: "right",
                    padding: "9px 10px",
                    border: `1px solid ${agent.accentColor}36`,
                    background: "rgba(8,8,13,0.54)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div>{String(lineSignalIndex + 1).padStart(2, "0")}</div>
                  <div style={{ color: "var(--text-dim)" }}>/{String(signals.length).padStart(2, "0")}</div>
                </div>
              </div>

              <div
                ref={(node) => {
                  horizontalRefs.current[agent.id] = node;
                }}
                onScroll={(event) => handleHorizontalScroll(agent.id, signals.length, event)}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  overflowX: "auto",
                  overflowY: "hidden",
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none",
                }}
              >
                {signals.map((signal, signalIndex) => (
                  <section
                    key={signal.id}
                    style={{
                      position: "relative",
                      flex: "0 0 100%",
                      minHeight: "calc(100svh - 80px)",
                      scrollSnapAlign: "start",
                      overflow: "hidden",
                    }}
                  >
                    <SignalAtmosphere signal={signal} agent={agent} priority={lineIndex === 0 && signalIndex === 0} />
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: "54%",
                        background:
                          "linear-gradient(to top, rgba(5,5,8,0.86) 0%, rgba(8,8,13,0.56) 42%, rgba(8,8,13,0.16) 76%, transparent 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 2,
                        left: 28,
                        right: 28,
                        bottom: 38,
                        transform: `translateX(${signalIndex === lineSignalIndex ? 0 : signalIndex < lineSignalIndex ? -10 : 10}px)`,
                        opacity: signalIndex === lineSignalIndex ? 1 : 0.75,
                        transition: "opacity 0.22s ease, transform 0.22s ease",
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 1,
                          background: agent.accentColor,
                          opacity: 0.66,
                          marginBottom: 14,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: agent.accentColor,
                          ...identity.metaStyle,
                          fontSize: 10,
                          letterSpacing: agent.id === "ines" ? 0 : "0.06em",
                          textShadow: "0 2px 12px rgba(0,0,0,0.85)",
                          marginBottom: 14,
                        }}
                      >
                        <span>{identity.symbol}</span>
                        <span>{signal.continuity ?? identity.shortLine}</span>
                      </div>
                      <p style={{ ...identity.voiceStyle }}>{signal.text}</p>
                      {signal.subtext && <p style={{ ...identity.subvoiceStyle }}>{signal.subtext}</p>}
                    </div>
                  </section>
                ))}
              </div>

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  zIndex: 6,
                  left: "50%",
                  bottom: 18,
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 7,
                }}
              >
                {signals.map((signal, dotIndex) => (
                  <span
                    key={signal.id}
                    style={{
                      width: dotIndex === lineSignalIndex ? 18 : 5,
                      height: 5,
                      borderRadius: 999,
                      background: dotIndex === lineSignalIndex ? agent.accentColor : "rgba(226,226,240,0.25)",
                      transition: "width 0.2s ease, background 0.2s ease",
                    }}
                  />
                ))}
              </div>

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  zIndex: 6,
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {lines.map((entry, dotIndex) => (
                  <span
                    key={entry.agent.id}
                    style={{
                      width: 4,
                      height: dotIndex === activeLineIndex ? 18 : 4,
                      borderRadius: 999,
                      background: dotIndex === activeLineIndex ? entry.agent.accentColor : "rgba(226,226,240,0.22)",
                      transition: "height 0.2s ease, background 0.2s ease",
                    }}
                  />
                ))}
              </div>
            </article>
          );
        })}
        <section
          style={{
            minHeight: "calc(100svh - 80px)",
            scrollSnapAlign: "start",
            display: "grid",
            placeItems: "center",
            padding: "32px 28px",
            textAlign: "center",
            background:
              "radial-gradient(circle at 50% 18%, rgba(124,111,240,0.12), transparent 34%), linear-gradient(180deg, #08080d, #050508)",
          }}
        >
          <div>
            <div
              style={{
                width: 46,
                height: 1,
                margin: "0 auto 22px",
                background: "var(--whisper)",
              }}
            />
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--ghost)",
              }}
            >
              {nextEvent ? "No hay mas senales por ahora." : "La linea quedo quieta."}
            </p>
            {nextEvent && (
              <p
                style={{
                  marginTop: 12,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "var(--whisper)",
                  textTransform: "lowercase",
                }}
              >
                algo vuelve despues
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
