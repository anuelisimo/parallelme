const gradients = [
  ["#2a1a4a", "#0d1a3a", "#08080d"],
  ["#3a1020", "#1a0d30", "#08080d"],
  ["#0d2a3a", "#1a1a2e", "#08080d"],
  ["#1a2a1a", "#0d1a30", "#08080d"],
  ["#3a2a0d", "#1a1030", "#08080d"],
  ["#1a0d2a", "#0d2030", "#08080d"],
];

export default function AtmosphericPlaceholder({ seed = 0, height = 180 }: { seed?: number; height?: number }) {
  const [a, b, c] = gradients[seed % gradients.length];
  return (
    <div style={{
      width: "100%", height,
      background: `radial-gradient(ellipse at 25% 40%, ${a}cc 0%, transparent 55%),
                   radial-gradient(ellipse at 75% 60%, ${b}99 0%, transparent 55%),
                   linear-gradient(135deg, ${c} 0%, #0f0f18 100%)`,
      borderRadius: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* subtle grain */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }} />
    </div>
  );
}
