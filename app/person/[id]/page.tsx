"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import AtmosphericPlaceholder from "@/components/AtmosphericPlaceholder";
import { useAppStore } from "@/lib/store";
import { signals } from "@/lib/mock";
import { t } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const agents = useAppStore((s) => s.agents);
  const following = useAppStore((s) => s.following);
  const followAgent = useAppStore((s) => s.followAgent);
  const recordView = useAppStore((s) => s.recordView);
  const lang = useAppStore((s) => s.lang);
  const agent = agents.find((a) => a.id === id);
  const isFollowing = following.includes(id);

  if (!agent) return (
    <AppShell>
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Lora', serif", fontStyle: "italic", color: "var(--ghost)" }}>
          {lang === 'es' ? 'Esta línea no existe.' : 'This line does not exist.'}
        </p>
      </div>
    </AppShell>
  );

  const personSignals = signals.filter((s) => s.agentId === id);
  const heroSignal = personSignals.find((s) => s.imageSrc);
  const showPerturbation = agent._perturbation > 40;
  const perturbationText = lang === 'es'
    ? (agent._perturbation > 80 ? "Hoy el día tuvo una textura diferente." : "Pedí dos cafés sin darme cuenta.")
    : (agent._perturbation > 80 ? "Today had a different texture." : "I ordered two coffees without realizing.");

  return (
    <AppShell>
      <div>
        <div style={{ position: "relative" }}>
          {heroSignal?.imageSrc ? (
            <div style={{ height: 280, position: "relative", overflow: "hidden" }}>
              <Image
                src={heroSignal.imageSrc}
                alt=""
                fill
                priority
                sizes="(max-width: 480px) 100vw, 480px"
                style={{
                  objectFit: "cover",
                  opacity: 0.96,
                  filter: "saturate(0.96) contrast(1.03) brightness(0.96)",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(8,8,13,0.02), rgba(8,8,13,0.18) 58%, var(--void) 100%)",
                }}
              />
            </div>
          ) : (
            <AtmosphericPlaceholder seed={agent._tension % 6} height={280} />
          )}
          <button onClick={() => router.back()} style={{ position: "absolute", top: 16, left: 16, background: "rgba(8,8,13,0.7)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}>
            <ArrowLeft size={16} color="var(--text-dim)" />
          </button>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 20px 20px", background: "linear-gradient(transparent, var(--void))" }}>
            <h1 style={{ fontSize: 28, fontWeight: 400, color: "var(--text)", marginBottom: 4 }}>{agent.name}</h1>
            <p style={{ fontSize: 13, color: "var(--ghost)" }}>{agent.city} · {agent.occupation}</p>
          </div>
        </div>

        <div style={{ padding: "20px 16px" }}>
          <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "16px", marginBottom: 16 }}>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)" }}>
              {agent.bio}
            </p>
          </div>

          {showPerturbation && (
            <div style={{ background: `${agent.accentColor}08`, border: `0.5px solid ${agent.accentColor}25`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 13, lineHeight: 1.6, color: "var(--ghost)" }}>
                "{perturbationText}"
              </p>
            </div>
          )}

          <button
            onClick={() => { followAgent(id); recordView(id); }}
            style={{ width: "100%", padding: "14px", background: isFollowing ? "transparent" : agent.accentColor, border: `1px solid ${isFollowing ? agent.accentColor + "60" : agent.accentColor}`, borderRadius: 14, cursor: "pointer", fontSize: 13, fontWeight: 500, color: isFollowing ? agent.accentColor : "#08080d", marginBottom: 24, transition: "all 0.2s" }}
          >
            {isFollowing ? t(lang, 'person_unfollow') : t(lang, 'person_follow')}
          </button>

          {personSignals.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--whisper)", letterSpacing: "0.1em", marginBottom: 16 }}>
                {t(lang, 'person_signals')}
              </div>
              {personSignals.map((sig) => (
                <div key={sig.id} style={{ borderLeft: "2px solid var(--border)", paddingLeft: 16, marginBottom: 20 }}>
                  <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.7, color: "var(--text-dim)", marginBottom: sig.subtext ? 4 : 0 }}>
                    {sig.text}
                  </p>
                  {sig.subtext && (
                    <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 12, color: "var(--ghost)", lineHeight: 1.5 }}>
                      {sig.subtext}
                    </p>
                  )}
                  <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--whisper)", display: "block", marginTop: 6 }}>
                    {sig.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
