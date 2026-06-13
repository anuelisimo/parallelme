"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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

function SignalAtmosphere({ signal, agent }: { signal: Signal; agent: Agent }) {
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
          priority={signal.id === "s1"}
          sizes="(max-width: 480px) 100vw, 480px"
          style={{
            objectFit: "cover",
            opacity: 0.95,
            filter: "saturate(0.96) contrast(1.03) brightness(0.96)",
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
            background: index === 0 ? `${agent.accentColor}${signal.imageSrc ? "08" : "12"}` : "transparent",
            transform: `translateY(${seed * 3}px) rotate(${(seed - index) * 2}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
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
          opacity: signal.imageSrc ? 0.13 : 0.28,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: signal.imageSrc
            ? `linear-gradient(to bottom, rgba(8,8,13,0.04), transparent 28%, rgba(8,8,13,0.18) 58%, rgba(8,8,13,0.74) 100%),
              linear-gradient(90deg, rgba(8,8,13,0.28), transparent 42%, rgba(8,8,13,0.12))`
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

function deckSignals(allAgents: Agent[], startedAt?: number) {
  const visibleSignals = startedAt ? getUnlockedSignals(startedAt) : [];
  const attendedAgentId = getAttendedCharacter(getSignalToAgentMap(visibleSignals));
  return visibleSignals
    .map((baseSignal) => {
      const signal = applyEcho(baseSignal, attendedAgentId);
      return {
        signal,
        agent: resolveSignalAgent(signal, allAgents),
      };
    })
    .filter((entry): entry is { signal: Signal; agent: Agent } => Boolean(entry.agent));
}

export default function SignalDeck() {
  const allAgents = useAppStore((state) => state.agents);
  const startedAt = useAppStore((state) => state.startedAt);
  const setStartedAt = useAppStore((state) => state.setStartedAt);
  const recordView = useAppStore((state) => state.recordView);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timelineTick, setTimelineTick] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const recordedRef = useRef<Set<string>>(new Set());
  const activeSignalIdRef = useRef<string | null>(null);
  const activeSignalStartedAtRef = useRef<number>(Date.now());
  const entries = useMemo(() => deckSignals(allAgents, startedAt), [allAgents, startedAt, timelineTick]);
  const nextEvent = useMemo(() => (startedAt ? getNextEvent(startedAt) : undefined), [startedAt, timelineTick]);

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
    const activeEntry = entries[activeIndex];
    const nextSignalId = activeEntry?.signal.id ?? null;
    const now = Date.now();

    if (activeSignalIdRef.current) {
      registerSignalView(activeSignalIdRef.current, now - activeSignalStartedAtRef.current);
    }

    activeSignalIdRef.current = nextSignalId;
    activeSignalStartedAtRef.current = now;

    return () => {
      if (!activeSignalIdRef.current) return;
      registerSignalView(activeSignalIdRef.current, Date.now() - activeSignalStartedAtRef.current);
      activeSignalIdRef.current = null;
    };
  }, [activeIndex, entries]);

  useEffect(() => {
    const entry = entries[activeIndex];
    if (!entry || recordedRef.current.has(entry.signal.id)) return;
    recordedRef.current.add(entry.signal.id);
    recordView(entry.agent.id);
  }, [activeIndex, entries, recordView]);

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;
    const nextIndex = Math.round(container.scrollTop / Math.max(container.clientHeight, 1));
    setActiveIndex(Math.min(entries.length - 1, Math.max(0, nextIndex)));
  }

  return (
    <div style={{ position: "relative", minHeight: "calc(100svh - 80px)", background: "#08080d" }}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: "calc(100svh - 80px)",
          overflowY: "auto",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
      >
        {entries.map(({ signal, agent }, index) => {
          const active = index === activeIndex;
          const identity = getCharacterIdentity(agent.id);
          return (
            <article
              key={signal.id}
              style={{
                minHeight: "calc(100svh - 80px)",
                scrollSnapAlign: "start",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "22px 18px 34px",
                overflow: "hidden",
              }}
            >
              <SignalAtmosphere signal={signal} agent={agent} />

              <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <Link href={`/person/${agent.id}`} style={{ minWidth: 0, textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CharacterMark agent={agent} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ color: "var(--text)", fontSize: 14, fontWeight: 500 }}>{agent.name}</span>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusDot[agent.status] }} />
                      </div>
                      <div style={{ color: "var(--ghost)", ...identity.metaStyle, fontSize: 11, marginTop: 2 }}>
                        {signal.chapter ?? `${agent.city} / ${signal.timeAgo}`}
                      </div>
                    </div>
                  </div>
                </Link>
                <div style={{ color: active ? agent.accentColor : "var(--whisper)", fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 1, marginTop: "auto", paddingTop: 120 }}>
                <div
                  style={{
                    width: 42,
                    height: 1,
                    background: agent.accentColor,
                    opacity: 0.55,
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
                    textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                    marginBottom: 14,
                  }}
                >
                  <span>{identity.symbol}</span>
                  <span>{signal.continuity ?? identity.shortLine}</span>
                </div>
                <p
                  style={{
                    ...identity.voiceStyle,
                  }}
                >
                  {signal.text}
                </p>
                {signal.subtext && (
                  <p
                    style={{
                      ...identity.subvoiceStyle,
                    }}
                  >
                    {signal.subtext}
                  </p>
                )}
              </div>

              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  zIndex: 2,
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {entries.map((entry, dotIndex) => (
                  <span
                    key={entry.signal.id}
                    style={{
                      width: 4,
                      height: dotIndex === activeIndex ? 18 : 4,
                      borderRadius: 999,
                      background: dotIndex === activeIndex ? entry.agent.accentColor : "rgba(226,226,240,0.22)",
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
