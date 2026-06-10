"use client";
import AppShell from "@/components/AppShell";
import SignalDeck from "@/components/SignalDeck";
import GlitchOverlay from "@/components/GlitchOverlay";
import LangToggle from "@/components/LangToggle";

export default function FeedPage() {
  return (
    <AppShell>
      <GlitchOverlay />
      <div style={{ position: "fixed", top: 18, right: "max(18px, calc((100vw - 480px) / 2 + 18px))", zIndex: 60 }}>
        <LangToggle />
      </div>
      <SignalDeck />
    </AppShell>
  );
}
