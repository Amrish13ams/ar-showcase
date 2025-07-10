import { DashboardProvider } from "@/contexts/dashboard-context"; // adjust if needed

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}