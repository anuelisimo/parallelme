"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export default function GlitchOverlay() {
  const [visible, setVisible] = useState(false);
  const [questionKey, setQuestionKey] = useState<1|2|3|4|5>(1);
  const glitchSeen = useAppStore((s) => s.glitchSeen);
  const triggerGlitch = useAppStore((s) => s.triggerGlitch);
  const lang = useAppStore((s) => s.lang);

  useEffect(() => {
    if (glitchSeen) return;
    const timer = setTimeout(() => {
      const keys = [1,2,3,4,5] as const;
      setQuestionKey(keys[Math.floor(Math.random() * keys.length)]);
      setVisible(true);
      triggerGlitch();
      setTimeout(() => setVisible(false), 2200);
    }, 45000);
    return () => clearTimeout(timer);
  }, [glitchSeen, triggerGlitch]);

  if (!visible) return null;

  const key = `glitch_${questionKey}` as any;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "var(--violet)", letterSpacing: "0.1em", animation: "glitch 0.3s ease, fadeIn 0.1s ease", textShadow: "0 0 20px var(--violet)", opacity: 0.9 }}>
        {t(lang, key)}
      </div>
    </div>
  );
}
