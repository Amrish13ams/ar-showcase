export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <aside className="w-64 fixed top-0 left-0 h-full bg-gray-800 text-white p-4">Sidebar</aside>
      <main className="ml-64 p-6">{children}</main>
    </div>
  );
}
