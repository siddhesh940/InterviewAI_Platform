export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="games-section">
      {children}
    </div>
  );
}
