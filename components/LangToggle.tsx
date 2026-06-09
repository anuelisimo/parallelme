"use client";
import { useAppStore } from "@/lib/store";

export default function LangToggle() {
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);

  return (
    <button
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.1em",
        color: "var(--ghost)",
        background: "none",
        border: "0.5px solid var(--border)",
        borderRadius: 6,
        padding: "3px 8px",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {lang === 'es' ? 'en' : 'es'}
    </button>
  );
}
