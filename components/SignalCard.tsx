"use client";
import { Signal, Agent } from "@/lib/types";
import { Lang, t } from "@/lib/i18n";
import AtmosphericPlaceholder from "./AtmosphericPlaceholder";
import Link from "next/link";

const statusDot: Record<string, string> = {
  active: "#3ec87a", unstable: "#d4607a", dormant: "#3a3a55", expanding: "#7c6ff0"
};

export default function SignalCard({ signal, agent, lang }: { signal: Signal; agent: Agent; lang: Lang }) {
  return (
    <article style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 20, overflow: "hidden", marginBottom: 16, animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
      <Link href={`/person/${agent.id}`} style={{ textDecoration: "none" }}>
        <div style={{ padding: "14px 16px 10px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${agent.accentColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500, color: agent.accentColor, background: `${agent.accentColor}10`, flexShrink: 0 }}>
            {agent.name[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{agent.name}</span>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: statusDot[agent.status], flexShrink: 0 }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--ghost)", fontFamily: "'DM Mono', monospace" }}>
              {agent.city} · {signal.timeAgo}
            </div>
          </div>
        </div>
      </Link>

      <div style={{ margin: "0 16px" }}>
        <AtmosphericPlaceholder seed={signal.gradientSeed} height={160} />
      </div>

      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)", marginBottom: signal.subtext ? 6 : 0 }}>
          {signal.text}
        </p>
        {signal.subtext && (
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.6, color: "var(--ghost)" }}>
            {signal.subtext}
          </p>
        )}
        <div style={{ display: "flex", gap: 20, marginTop: 14, paddingTop: 12, borderTop: "0.5px solid var(--border)" }}>
          {[
            { val: signal.gazes, label: t(lang, 'feed_gazes') },
            { val: signal.echoes, label: t(lang, 'feed_echoes') },
          ].map(({ val, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "var(--ghost)" }}>{val}</span>
              <span style={{ fontSize: 11, color: "var(--whisper)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
