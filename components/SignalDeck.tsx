"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { agents as fallbackAgents, signals } from "@/lib/mock";
import { useAppStore } from "@/lib/store";
import { Agent, Signal } from "@/lib/types";

const statusDot: Record<string, string> = {
  active: "#3ec87a",
  unstable: "#d4607a",
  dormant: "#3a3a55",
  expanding: "#7c6ff0",
};

const atmosphereShapes = [
  { left: "14%", top: "18%", width: "34%", height: "46%", radius: 4, opacity: 0.1 },
  { left: "58%", top: "12%", width: "22%", height: "58%", radius: 999, opacity: 0.08 },
  { left: "22%", top: "62%", width: "52%", height: "1px", radius: 0, opacity: 0.16 },
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
            background: index === 0 ? `${agent.accentColor}12` : "transparent",
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
          opacity: 0.28,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(8,8,13,0.08), rgba(8,8,13,0.34) 48%, rgba(8,8,13,0.86))",
        }}
      />
    </div>
  );
}

function deckSignals(allAgents: Agent[]) {
  return signals
    .map((signal) => ({
      signal,
      agent: allAgents.find((agent) => agent.id === signal.agentId) ?? fallbackAgents.find((agent) => agent.id === signal.agentId),
    }))
    .filter((entry): entry is { signal: Signal; agent: Agent } => Boolean(entry.agent));
}

export default function SignalDeck() {
  const allAgents = useAppStore((state) => state.agents);
  const recordView = useAppStore((state) => state.recordView);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const recordedRef = useRef<Set<string>>(new Set());
  const entries = useMemo(() => deckSignals(allAgents), [allAgents]);

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
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: agent.accentColor,
                        border: `1px solid ${agent.accentColor}52`,
                        background: "rgba(8,8,13,0.35)",
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {agent.name[0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ color: "var(--text)", fontSize: 14, fontWeight: 500 }}>{agent.name}</span>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: statusDot[agent.status] }} />
                      </div>
                      <div style={{ color: "var(--ghost)", fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 2 }}>
                        {agent.city} / {signal.timeAgo}
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
                    marginBottom: 24,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 22,
                    lineHeight: 1.45,
                    color: "var(--text)",
                    textWrap: "balance",
                    textShadow: "0 12px 34px rgba(0,0,0,0.65)",
                  }}
                >
                  {signal.text}
                </p>
                {signal.subtext && (
                  <p
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                      fontStyle: "italic",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--text-dim)",
                      marginTop: 12,
                      maxWidth: 360,
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
      </div>
    </div>
  );
}
