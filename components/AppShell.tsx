import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <main style={{ paddingBottom: 80 }}>{children}</main>
      <BottomNav />
    </div>
  );
}
