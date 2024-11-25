import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { filterRoleMenu } from "@/utils/server/rbac";
import SidebarWrapper from "@/app/(dashboard)/_components/SidebarWrapper";
import NavbarWrapper from "@/app/(dashboard)/_components/NavbarWrapper";
import DashboardModal from "@/app/(dashboard)/_components/DashboardModal";
import { getAllSites, getUserSites } from "@/libs/site";
import first from "lodash/first";
import NotAllowed from "@/components/NotAllowed";

import menus from "./menus";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    return redirect("/signin");
  }

  let sites;
  if ("admin" !== session.user.role) {
    // redirect to their first site.
    sites = await getUserSites(session.user.id!);
    const firstSite = first(sites);

    if (!firstSite) {
      return <NotAllowed />;
    }

    return redirect(`/manage/${firstSite.id}`);
  } else {
    sites = await getAllSites();
  }

  const filteredMenu = await filterRoleMenu(session.user.role, menus);
  return (
    <section className="flex">
      <SidebarWrapper isMainDashboard menus={filteredMenu} sites={sites} />
      <NavbarWrapper>{children}</NavbarWrapper>
      <DashboardModal />
    </section>
  );
}
