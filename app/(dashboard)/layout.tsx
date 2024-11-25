import { auth } from "@/auth";
import DashboardProvider from "@/contexts/dashboard";
import { redirect } from "next/navigation";
import { getRoles } from "@/utils/server/rbac";

// ag grid styles
import "@ag-grid-community/styles/ag-grid.css"; // Core CSS
import "@/styles/ag-grid-theme.css"; // Theme

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    return redirect("/signin");
  }

  const roles = await getRoles(false);
  return (
    <DashboardProvider
      value={{
        role: session.user.role,
        roles,
      }}
    >
      {children}
    </DashboardProvider>
  );
}
