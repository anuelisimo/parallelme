"use client";
import AppShell from "@/components/AppShell";
import SignalCard from "@/components/SignalCard";
import GlitchOverlay from "@/components/GlitchOverlay";
import LangToggle from "@/components/LangToggle";
import { signals, agents } from "@/lib/mock";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export default function FeedPage() {
  const lang = useAppStore((s) => s.lang);
  const allAgents = useAppStore((s) => s.agents);

  return (
    <AppShell>
      <GlitchOverlay />
      <div style={{ padding: "52px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.12em", textTransform: "lowercase", marginBottom: 4 }}>
              {t(lang, 'feed_active')}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3ec87a", boxShadow: "0 0 8px #3ec87a", animation: "pulse-glow 3s ease infinite" }} />
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
                {allAgents.length} {t(lang, 'feed_presences')}
              </span>
            </div>
          </div>
          <LangToggle />
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {signals.map((signal, i) => {
          const agent = allAgents.find((a) => a.id === signal.agentId) ?? agents.find((a) => a.id === signal.agentId);
          if (!agent) return null;
          return (
            <div key={signal.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <SignalCard signal={signal} agent={agent} lang={lang} />
            </div>
          );
        })}
        <div style={{ textAlign: "center", padding: "32px 0 16px", fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--whisper)" }}>
          {t(lang, 'feed_empty')}
        </div>
      </div>
    </AppShell>
  );
}
