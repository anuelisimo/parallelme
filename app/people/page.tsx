"use client";
import AppShell from "@/components/AppShell";
import LangToggle from "@/components/LangToggle";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { getStartedAt, getVisibleAgents } from "@/lib/timeline";
import { useEffect, useMemo, useState } from "react";

const statusDot: Record<string, string> = {
  active: "#3ec87a", unstable: "#d4607a", dormant: "#3a3a55", expanding: "#7c6ff0"
};

export default function PeoplePage() {
  const allAgents = useAppStore((s) => s.agents);
  const startedAt = useAppStore((s) => s.startedAt);
  const setStartedAt = useAppStore((s) => s.setStartedAt);
  const following = useAppStore((s) => s.following);
  const lang = useAppStore((s) => s.lang);
  const [timelineTick, setTimelineTick] = useState(0);
  const visibleAgents = useMemo(
    () => (startedAt ? getVisibleAgents(startedAt, allAgents) : []),
    [allAgents, startedAt, timelineTick]
  );
  const followed = visibleAgents.filter((a) => following.includes(a.id));
  const others = visibleAgents.filter((a) => !following.includes(a.id));

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.12em", marginBottom: 4 }}>
              {t(lang, 'people_title')}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 400, color: "var(--text)" }}>
              {t(lang, 'people_subtitle')}
            </h1>
          </div>
          <LangToggle />
        </div>

        {followed.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--whisper)", letterSpacing: "0.1em", marginBottom: 12 }}>
              {t(lang, 'people_following')}
            </div>
            {followed.map((agent) => (
              <PersonRow key={agent.id} agent={agent} lang={lang} isFollowing />
            ))}
          </div>
        )}

        <div>
          {followed.length > 0 && (
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--whisper)", letterSpacing: "0.1em", marginBottom: 12 }}>
              {t(lang, 'people_others')}
            </div>
          )}
          {others.map((agent) => (
            <PersonRow key={agent.id} agent={agent} lang={lang} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function PersonRow({ agent, lang, isFollowing }: { agent: any; lang: any; isFollowing?: boolean }) {
  const statusKey = `status_${agent.status}` as any;
  return (
    <Link href={`/person/${agent.id}`} style={{ textDecoration: "none" }}>
      <div style={{ background: "var(--card)", border: `0.5px solid ${isFollowing ? agent.accentColor + "40" : "var(--border)"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${agent.accentColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 500, color: agent.accentColor, background: `${agent.accentColor}10`, flexShrink: 0 }}>
          {agent.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>{agent.name}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusDot[agent.status] }} />
              <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)" }}>
                {t(lang, statusKey)}
              </span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--ghost)", marginBottom: 4 }}>{agent.city}</div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 12, color: "var(--whisper)", lineHeight: 1.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {agent.lastSignal}
          </p>
        </div>
      </div>
    </Link>
  );
}
