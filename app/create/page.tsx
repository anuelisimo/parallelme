"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import LangToggle from "@/components/LangToggle";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

const accentColors = ["#7c6ff0", "#d4607a", "#3ebfcc", "#d4924a", "#3ec87a", "#9b8ff5"];

export default function CreatePage() {
  const router = useRouter();
  const addUserAgent = useAppStore((s) => s.addUserAgent);
  const lang = useAppStore((s) => s.lang);
  const [step, setStep] = useState<"form" | "result">("form");
  const [name, setName] = useState("");
  const [premise, setPremise] = useState("");
  const [city, setCity] = useState("");
  const [tone, setTone] = useState("");
  const [difference, setDifference] = useState("");
  const [accent, setAccent] = useState(accentColors[0]);

  const tones = [
    { id: "carver", label: t(lang, 'tone_everyday'), desc: t(lang, 'tone_everyday_desc') },
    { id: "bolano", label: t(lang, 'tone_unsettling'), desc: t(lang, 'tone_unsettling_desc') },
    { id: "saramago", label: t(lang, 'tone_philosophical'), desc: t(lang, 'tone_philosophical_desc') },
    { id: "sebald", label: t(lang, 'tone_melancholic'), desc: t(lang, 'tone_melancholic_desc') },
  ];

  const differences = [
    t(lang, 'diff_left_city'), t(lang, 'diff_chose_other'), t(lang, 'diff_said_yes'),
    t(lang, 'diff_didnt_return'), t(lang, 'diff_dared'), t(lang, 'diff_night'),
  ];

  const handleCreate = () => {
    if (!name || !city) return;
    addUserAgent({
      name, age: 30 + Math.floor(Math.random() * 12), city,
      occupation: lang === 'es' ? "no especificado todavía" : "not specified yet",
      status: "active", tone: (tone as any) || "carver", hook: "desire",
      accentColor: accent,
      lastSignal: premise || (lang === 'es' ? "Acaba de aparecer. No hay señal todavía." : "Just appeared. No signal yet."),
      lastSignalTime: lang === 'es' ? "ahora" : "now",
      bio: lang === 'es'
        ? `La decisión que lo diferencia: ${difference || "una que no se nombra todavía"}.`
        : `The decision that sets them apart: ${difference || "one that hasn't been named yet"}.`,
    });
    setStep("result");
  };

  if (step === "result") return (
    <AppShell>
      <div style={{ padding: "80px 24px", textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", border: `1px solid ${accent}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24, color: accent }}>
          {name[0] || "·"}
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 8 }}>{name}</h2>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ghost)", marginBottom: 40, lineHeight: 1.6, whiteSpace: "pre-line" }}>
          {t(lang, 'create_success')}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => router.push("/")} style={{ padding: "14px", borderRadius: 14, border: "none", background: accent, color: "#08080d", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            {t(lang, 'create_back')}
          </button>
          <button onClick={() => { setStep("form"); setName(""); setPremise(""); setCity(""); setTone(""); setDifference(""); }} style={{ padding: "14px", borderRadius: 14, border: "0.5px solid var(--border)", background: "transparent", color: "var(--ghost)", fontSize: 13, cursor: "pointer" }}>
            {t(lang, 'create_another')}
          </button>
        </div>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div style={{ padding: "52px 16px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.12em", marginBottom: 4 }}>
              {t(lang, 'create_subtitle')}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 400, color: "var(--text)", marginBottom: 6 }}>
              {t(lang, 'create_title')}
            </h1>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", fontSize: 13, color: "var(--ghost)", lineHeight: 1.5 }}>
              {t(lang, 'create_desc')}
            </p>
          </div>
          <LangToggle />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { key: 'create_name', val: name, set: setName, placeholder: lang === 'es' ? "Lucas, Camila, Seo-jun..." : "Lucas, Camila, Seo-jun..." },
            { key: 'create_city', val: city, set: setCity, placeholder: lang === 'es' ? "Lisboa, Tokio, Rosario..." : "Lisbon, Tokyo, Rosario..." },
          ].map(({ key, val, set, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                {t(lang, key as any)}
              </label>
              <input value={val} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                style={{ width: "100%", background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "var(--text)", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
              {t(lang, 'create_signal')}
            </label>
            <textarea value={premise} onChange={(e) => setPremise(e.target.value)}
              placeholder={t(lang, 'create_signal_placeholder')} rows={3}
              style={{ width: "100%", background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "var(--text)", outline: "none", resize: "none", fontFamily: "'Lora', Georgia, serif", fontStyle: "italic", lineHeight: 1.6 }} />
          </div>

          <div>
            <label style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>
              {t(lang, 'create_difference')}
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {differences.map((d) => (
                <button key={d} onClick={() => setDifference(d)} style={{ padding: "7px 14px", borderRadius: 20, border: `0.5px solid ${difference === d ? "var(--violet)" : "var(--border)"}`, background: difference === d ? "var(--violet-glow)" : "transparent", color: difference === d ? "var(--violet)" : "var(--ghost)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>
              {t(lang, 'create_tone')}
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tones.map((to) => (
                <button key={to.id} onClick={() => setTone(to.id)} style={{ padding: "12px 14px", borderRadius: 12, textAlign: "left", border: `0.5px solid ${tone === to.id ? "var(--violet)" : "var(--border)"}`, background: tone === to.id ? "var(--violet-glow)" : "var(--card)", cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: tone === to.id ? "var(--violet)" : "var(--text)", marginBottom: 2 }}>{to.label}</div>
                  <div style={{ fontSize: 11, color: "var(--ghost)", fontFamily: "'Lora', serif", fontStyle: "italic" }}>{to.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "var(--ghost)", letterSpacing: "0.1em", display: "block", marginBottom: 10 }}>
              {t(lang, 'create_color')}
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {accentColors.map((c) => (
                <button key={c} onClick={() => setAccent(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: "none", outline: accent === c ? `2px solid ${c}` : "none", outlineOffset: 3, cursor: "pointer", transform: accent === c ? "scale(1.15)" : "scale(1)", transition: "all 0.15s" }} />
              ))}
            </div>
          </div>

          <button onClick={handleCreate} disabled={!name || !city}
            style={{ padding: "15px", borderRadius: 14, border: "none", background: name && city ? accent : "var(--muted)", color: name && city ? "#08080d" : "var(--ghost)", fontSize: 13, fontWeight: 500, cursor: name && city ? "pointer" : "default", marginTop: 8, transition: "all 0.2s" }}>
            {t(lang, 'create_submit')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
