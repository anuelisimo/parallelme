type Props = {
  gradient: string;
  height?: string;
  children?: React.ReactNode;
};

const patterns = [
  "radial-gradient(ellipse at 20% 50%, #3d356640 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #1a3a5040 0%, transparent 60%)",
  "radial-gradient(ellipse at 70% 70%, #5c1a3a40 0%, transparent 60%), radial-gradient(ellipse at 30% 30%, #1a2a5040 0%, transparent 60%)",
  "radial-gradient(ellipse at 50% 80%, #0d334040 0%, transparent 60%), radial-gradient(ellipse at 60% 10%, #3d356640 0%, transparent 70%)",
  "radial-gradient(ellipse at 10% 90%, #2a1a4040 0%, transparent 60%), radial-gradient(ellipse at 90% 10%, #0d334040 0%, transparent 60%)",
];

let counter = 0;

export default function AtmosphericImage({ gradient, height = "180px", children }: Props) {
  const pattern = patterns[counter++ % patterns.length];
  return (
    <div
      className="atmospheric-image w-full relative"
      style={{
        height,
        background: `${pattern}, linear-gradient(135deg, #0a0a0f 0%, #111118 100%)`,
      }}
    >
      <div className="grain" />
      {children && (
        <div className="absolute inset-0 flex items-end p-4">{children}</div>
      )}
    </div>
  );
}
