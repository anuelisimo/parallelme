"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export default function BottomNav() {
  const path = usePathname();
  const lang = useAppStore((s) => s.lang);

  const nav = [
    { href: "/", key: 'nav_feed' as const },
    { href: "/people", key: 'nav_people' as const },
    { href: "/messages", key: 'nav_messages' as const },
    { href: "/create", key: 'nav_create' as const },
  ];

  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, borderTop: "0.5px solid var(--border)", background: "rgba(8,8,13,0.92)", backdropFilter: "blur(20px)", paddingBottom: "env(safe-area-inset-bottom, 12px)" }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "12px 8px 8px", maxWidth: 480, margin: "0 auto" }}>
        {nav.map(({ href, key }) => {
          const active = path === href;
          const label = t(lang, key);
          return (
            <Link key={href} href={href} style={{ fontSize: label === "+" ? 22 : 11, fontFamily: label === "+" ? "inherit" : "'DM Mono', monospace", fontWeight: label === "+" ? 300 : 400, letterSpacing: label === "+" ? 0 : "0.08em", color: active ? "var(--violet)" : "var(--ghost)", textDecoration: "none", padding: "6px 12px", transition: "color 0.2s", textTransform: "lowercase" }}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
