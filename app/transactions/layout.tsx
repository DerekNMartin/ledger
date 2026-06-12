export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col h-[calc(100vh-112px)] max-w-7xl mx-auto p-6 xl:p-0">
      {children}
    </main>
  );
}
