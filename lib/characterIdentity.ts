import type { CSSProperties } from "react";

type CharacterIdentity = {
  symbol: string;
  shortLine: string;
  avatarBackground: string;
  avatarOverlay: string;
  voiceStyle: CSSProperties;
  subvoiceStyle: CSSProperties;
  metaStyle: CSSProperties;
};

const baseVoice: CSSProperties = {
  fontSize: 22,
  lineHeight: 1.45,
  color: "var(--text)",
  textWrap: "balance",
  textShadow: "0 3px 18px rgba(0,0,0,0.9), 0 12px 34px rgba(0,0,0,0.48)",
};

const baseSubvoice: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.65,
  color: "var(--text-dim)",
  marginTop: 12,
  maxWidth: 360,
  textShadow: "0 2px 14px rgba(0,0,0,0.85)",
};

const identities: Record<string, CharacterIdentity> = {
  lucas: {
    symbol: "L",
    shortLine: "ventana / valija / cafe",
    avatarBackground:
      "linear-gradient(135deg, rgba(124,111,240,0.28), rgba(8,8,13,0.6)), repeating-linear-gradient(90deg, transparent 0 7px, rgba(226,226,240,0.12) 7px 8px)",
    avatarOverlay: "linear-gradient(115deg, transparent 0 45%, rgba(226,226,240,0.48) 46% 48%, transparent 49%)",
    voiceStyle: {
      ...baseVoice,
      fontFamily: "'Lora', Georgia, serif",
      fontStyle: "italic",
      fontWeight: 400,
    },
    subvoiceStyle: {
      ...baseSubvoice,
      fontFamily: "'Lora', Georgia, serif",
      fontStyle: "italic",
    },
    metaStyle: { fontFamily: "'DM Mono', monospace" },
  },
  ines: {
    symbol: "I",
    shortLine: "harina / mate / costa",
    avatarBackground:
      "radial-gradient(circle at 35% 35%, rgba(255,236,192,0.55), transparent 26%), linear-gradient(145deg, rgba(212,146,74,0.34), rgba(8,8,13,0.62))",
    avatarOverlay:
      "radial-gradient(circle at 62% 58%, transparent 0 30%, rgba(226,226,240,0.42) 31% 32%, transparent 33%), radial-gradient(circle, rgba(255,255,255,0.32) 0 1px, transparent 2px)",
    voiceStyle: {
      ...baseVoice,
      fontFamily: "'Newsreader', 'Lora', Georgia, serif",
      fontStyle: "normal",
      fontWeight: 400,
    },
    subvoiceStyle: {
      ...baseSubvoice,
      fontFamily: "'Newsreader', 'Lora', Georgia, serif",
      fontStyle: "normal",
    },
    metaStyle: { fontFamily: "'DM Sans', system-ui, sans-serif" },
  },
  "seo-jun": {
    symbol: "S",
    shortLine: "plano / metal / dawn",
    avatarBackground:
      "linear-gradient(135deg, rgba(62,191,204,0.24), rgba(8,8,13,0.65)), linear-gradient(90deg, rgba(226,226,240,0.12) 1px, transparent 1px), linear-gradient(rgba(226,226,240,0.12) 1px, transparent 1px)",
    avatarOverlay: "linear-gradient(45deg, transparent 0 42%, rgba(62,191,204,0.6) 43% 45%, transparent 46%)",
    voiceStyle: {
      ...baseVoice,
      fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: 1.36,
    },
    subvoiceStyle: {
      ...baseSubvoice,
      fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
      fontStyle: "normal",
      lineHeight: 1.55,
    },
    metaStyle: { fontFamily: "'DM Mono', monospace" },
  },
  rami: {
    symbol: "?",
    shortLine: "boleto / formas / noche",
    avatarBackground:
      "linear-gradient(145deg, rgba(212,96,122,0.28), rgba(8,8,13,0.66)), linear-gradient(90deg, rgba(226,226,240,0.09) 1px, transparent 1px), linear-gradient(rgba(226,226,240,0.09) 1px, transparent 1px)",
    avatarOverlay:
      "conic-gradient(from 90deg, transparent 0 22%, rgba(226,226,240,0.48) 23% 25%, transparent 26% 58%, rgba(212,96,122,0.7) 59% 61%, transparent 62%)",
    voiceStyle: {
      ...baseVoice,
      fontFamily: "'IBM Plex Mono', 'DM Mono', monospace",
      fontStyle: "normal",
      fontSize: 20,
      lineHeight: 1.5,
    },
    subvoiceStyle: {
      ...baseSubvoice,
      fontFamily: "'IBM Plex Mono', 'DM Mono', monospace",
      fontStyle: "normal",
      fontSize: 13,
      lineHeight: 1.55,
    },
    metaStyle: { fontFamily: "'IBM Plex Mono', 'DM Mono', monospace" },
  },
  felix: {
    symbol: "F",
    shortLine: "vino / discos / cocina",
    avatarBackground:
      "radial-gradient(circle at 70% 28%, rgba(255,255,255,0.4), transparent 13%), linear-gradient(145deg, rgba(159,122,234,0.3), rgba(8,8,13,0.68))",
    avatarOverlay:
      "repeating-linear-gradient(-18deg, transparent 0 7px, rgba(226,226,240,0.16) 7px 8px), linear-gradient(90deg, transparent, rgba(0,0,0,0.28))",
    voiceStyle: {
      ...baseVoice,
      fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
      fontStyle: "normal",
      fontSize: 21,
      lineHeight: 1.42,
    },
    subvoiceStyle: {
      ...baseSubvoice,
      fontFamily: "'Space Grotesk', 'DM Sans', system-ui, sans-serif",
      fontStyle: "normal",
    },
    metaStyle: { fontFamily: "'DM Mono', monospace" },
  },
};

const fallbackIdentity: CharacterIdentity = {
  symbol: "·",
  shortLine: "linea abierta",
  avatarBackground: "linear-gradient(145deg, rgba(124,111,240,0.25), rgba(8,8,13,0.66))",
  avatarOverlay: "radial-gradient(circle, transparent 0 42%, rgba(226,226,240,0.34) 43% 45%, transparent 46%)",
  voiceStyle: {
    ...baseVoice,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
  },
  subvoiceStyle: {
    ...baseSubvoice,
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
  },
  metaStyle: { fontFamily: "'DM Mono', monospace" },
};

export function getCharacterIdentity(agentId: string) {
  return identities[agentId] ?? fallbackIdentity;
}
