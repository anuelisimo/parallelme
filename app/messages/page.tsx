"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import AppShell from "@/components/AppShell";
import CharacterMark from "@/components/CharacterMark";
import { agents } from "@/lib/mock";
import { getCharacterIdentity } from "@/lib/characterIdentity";
import { getStartedAt, getUnlockedThreads } from "@/lib/timeline";
import { useAppStore } from "@/lib/store";
import { Agent, Message, Thread } from "@/lib/types";

export default function MessagesPage() {
  const [selected, setSelected] = useState<Thread | null>(null);
  if (selected) return <ThreadView thread={selected} onBack={() => setSelected(null)} />;
  return <ThreadList onSelect={setSelected} />;
}

function ThreadList({ onSelect }: { onSelect: (t: Thread) => void }) {
  const startedAt = useAppStore((s) => s.startedAt);
  const setStartedAt = useAppStore((s) => s.setStartedAt);
  const [timelineTick, setTimelineTick] = useState(0);
  const visibleThreads = useMemo(
    () => (startedAt ? getUnlockedThreads(startedAt) : []),
    [startedAt, timelineTick]
  );

  useEffect(() => {
    if (startedAt) return;
    setStartedAt(getStartedAt());
  }, [setStartedAt, startedAt]);

  useEffect(() => {
    const interval = window.setInterval(() => setTimelineTick((tick) => tick + 1), 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <AppShell>
      <div style={{ padding: "52px 16px 16px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            color: "var(--ghost)",
            letterSpacing: "0.12em",
            marginBottom: 4,
          }}>
            senales privadas
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 400, color: "var(--text)" }}>mensajes</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visibleThreads.length === 0 && (
            <div style={{ padding: "42px 18px", textAlign: "center", border: "0.5px solid var(--border)", borderRadius: 16, background: "rgba(19,19,30,0.55)" }}>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ghost)", lineHeight: 1.6 }}>
                Todavia no llego nada.
              </p>
            </div>
          )}
          {visibleThreads.map((thread) => {
            const agent = agents.find((a) => a.id === thread.agentId);
            const isSystem = thread.id === "t-system";
            const isObserver = thread.id === "t-observer";
            const name = isSystem ? "-" : isObserver ? "desconocido" : agent?.name ?? "?";
            const color = isSystem ? "var(--ghost)" : isObserver ? "var(--whisper)" : agent?.accentColor ?? "var(--violet)";
            const identity = agent ? getCharacterIdentity(agent.id) : undefined;

            return (
              <button
                key={thread.id}
                onClick={() => onSelect(thread)}
                style={{
                  background: "var(--card)",
                  border: "0.5px solid var(--border)",
                  borderRadius: 16,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.2s",
                }}
              >
                <ThreadAvatar agent={agent} color={color} isObserver={isObserver} isSystem={isSystem} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)" }}>
                        {thread.lastTime}
                      </span>
                      {thread.unread > 0 && (
                        <div style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          color: "#08080d",
                          fontWeight: 600,
                        }}>
                          {thread.unread}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{
                    fontFamily: identity?.subvoiceStyle.fontFamily ?? "'Lora', Georgia, serif",
                    fontStyle: identity?.subvoiceStyle.fontStyle ?? "italic",
                    fontSize: 12,
                    color: "var(--ghost)",
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    "{thread.lastMessage}"
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

const bubbleStyle: Record<Message["sender"], React.CSSProperties> = {
  them: { background: "var(--card)", border: "0.5px solid var(--border)", alignSelf: "flex-start", maxWidth: "82%" },
  system: { background: "rgba(124,111,240,0.08)", border: "0.5px solid rgba(124,111,240,0.2)", alignSelf: "center", maxWidth: "90%" },
  observer: { background: "rgba(107,107,138,0.1)", border: "0.5px solid rgba(107,107,138,0.2)", alignSelf: "flex-start", maxWidth: "82%" },
};

function ThreadView({ thread, onBack }: { thread: Thread; onBack: () => void }) {
  const agent = agents.find((a) => a.id === thread.agentId);
  const isSystem = thread.id === "t-system";
  const isObserver = thread.id === "t-observer";
  const name = isSystem ? "-" : isObserver ? "desconocido" : agent?.name ?? "?";
  const color = isSystem ? "var(--ghost)" : isObserver ? "var(--whisper)" : agent?.accentColor ?? "var(--violet)";
  const identity = agent ? getCharacterIdentity(agent.id) : undefined;

  return (
    <AppShell>
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingTop: 8 }}>
          <button onClick={onBack} style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}>
            <ArrowLeft size={18} color="var(--ghost)" />
          </button>
          <ThreadAvatar agent={agent} color={color} isObserver={isObserver} isSystem={isSystem} size={32} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{name}</div>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)" }}>
              {isSystem ? "red" : isObserver ? "origen desconocido" : agent?.city}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>
          {thread.messages.map((msg) => (
            <div key={msg.id} style={{
              ...bubbleStyle[msg.sender],
              borderRadius: 16,
              padding: "10px 14px",
              display: "flex",
              flexDirection: "column",
            }}>
              <p style={{
                fontFamily: identity?.subvoiceStyle.fontFamily ?? "'Lora', Georgia, serif",
                fontStyle: identity?.subvoiceStyle.fontStyle ?? "italic",
                fontSize: 13,
                lineHeight: 1.6,
                color: "var(--text-dim)",
              }}>
                {msg.text}
              </p>
              <span style={{
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
                color: "var(--whisper)",
                marginTop: 6,
                textAlign: "right",
              }}>
                {msg.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function ThreadAvatar({
  agent,
  color,
  isObserver,
  isSystem,
  size,
}: {
  agent?: Agent;
  color: string;
  isObserver: boolean;
  isSystem: boolean;
  size: number;
}) {
  if (agent && !isObserver && !isSystem) return <CharacterMark agent={agent} size={size} />;

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `1px solid ${color}40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isSystem ? 16 : 13,
      color,
      background: `${color}10`,
      flexShrink: 0,
    }}>
      {isSystem ? "." : isObserver ? "?" : "?"}
    </div>
  );
}
