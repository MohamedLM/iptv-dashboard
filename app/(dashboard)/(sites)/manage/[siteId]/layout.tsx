import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { filterRoleMenu } from "@/utils/server/rbac";
import SidebarWrapper from "@/app/(dashboard)/_components/SidebarWrapper";
import NavbarWrapper from "@/app/(dashboard)/_components/NavbarWrapper";
import DashboardModal from "@/app/(dashboard)/_components/DashboardModal";
import NotAllowed from "@/components/NotAllowed";
import { getAllSites, getUserSites } from "@/libs/site";
import { SiteLayoutProps } from "@/types/dashboard";
import SiteProvider from "@/contexts/site";
import find from "lodash/find";
import map from "lodash/map";

import menus from "./menus";

const mapSiteMenu = (siteId: string, data: any) => {
  return map(data, (d) => {
    if (d.menus) {
      const mappedMenus = map(d.menus, (d) => ({
        ...d,
        siteId,
      }));

      return {
        ...d,
        menus: mappedMenus,
      };
    }
    return {
      ...d,
      siteId,
    };
  });
};

export default async function DashboardLayout({
  params,
  children,
}: SiteLayoutProps) {
  const session = await auth();
  if (!session) {
    return redirect("/signin");
  }
  const isAdmin = "admin" === session.user.role;
  let sites;
  if (isAdmin) {
    sites = await getAllSites("admin");
  } else {
    sites = await getUserSites(session.user.id!);
  }

  const activeSite = find(sites, { id: params.siteId });
  if (!activeSite) {
    return <NotAllowed />;
  }

  const role = isAdmin ? "admin" : activeSite?.role || "user";
  const filteredMenu = await filterRoleMenu(role, menus);
  const siteMenus = mapSiteMenu(params.siteId, filteredMenu);

  // return <pre>{JSON.stringify({u: session.user.id, sites}, null, 2)}</pre>;

  return (
    <SiteProvider value={{ activeSite: activeSite! }}>
      <section className="flex">
        <SidebarWrapper menus={siteMenus} sites={sites} />
        <NavbarWrapper>{children}</NavbarWrapper>
        <DashboardModal />
      </section>
    </SiteProvider>
  );
}
