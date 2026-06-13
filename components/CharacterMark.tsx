import { getCharacterIdentity } from "@/lib/characterIdentity";
import { Agent } from "@/lib/types";

export default function CharacterMark({ agent, size = 36 }: { agent: Agent; size?: number }) {
  const identity = getCharacterIdentity(agent.id);

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${agent.accentColor}66`,
        background: identity.avatarBackground,
        backgroundSize: agent.id === "seo-jun" || agent.id === "rami" ? "100%, 8px 8px, 8px 8px" : "auto",
        boxShadow: `0 0 0 1px rgba(8,8,13,0.45), 0 8px 24px ${agent.accentColor}22`,
        color: agent.accentColor,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: identity.avatarOverlay,
          opacity: 0.9,
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontFamily: identity.metaStyle.fontFamily,
          fontSize: Math.max(10, Math.round(size * 0.32)),
          fontWeight: 600,
          textShadow: "0 1px 10px rgba(0,0,0,0.75)",
          transform: agent.id === "rami" ? "rotate(-7deg)" : "none",
        }}
      >
        {identity.symbol}
      </span>
    </div>
  );
}
