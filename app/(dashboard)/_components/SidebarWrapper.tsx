"use client";

import { Sidebar } from "./styles/sidebar.styles";
import SiteDropdown from "./SiteDropdown";
import SidebarItem from "./SidebarItem";
import SidebarMenu from "./SidebarMenu";
import { usePathname } from "next/navigation";
import { useDashboardContext } from "@/contexts/dashboard";
import { ReactNode } from "react";
import { MenuProps } from "@/types/dashboard";
import OverviewMenu from "./OverviewMenu";
import { SiteData } from "@/contexts/site";
import CollapseItems from "./CollapseItems";

const MenuItem = (props: {
  title: string;
  icon?: ReactNode;
  path?: string;
  siteId?: string;
}) => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const isActive =
    paths.includes(props.path || "") ||
    ("/" === pathname && "" === props.path) ||
    (`/manage/${props.siteId}` === pathname && "" === props.path);

  return (
    <SidebarItem
      title={props.title}
      icon={props.icon}
      isActive={isActive}
      href={
        props.siteId
          ? `/manage/${props.siteId}/${props.path}`
          : `/${props.path}`
      }
    />
  );
};

export default function SidebarWrapper({
  isMainDashboard,
  menus,
  sites,
}: {
  isMainDashboard?: boolean;
  menus: MenuProps[];
  sites?: Array<SiteData>;
}) {
  const { sidebarOpen, toggleSidebar } = useDashboardContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {sidebarOpen ? (
        <div className={Sidebar.Overlay()} onClick={toggleSidebar} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: sidebarOpen,
        })}
      >
        <div className={Sidebar.Header()}>
          {!isMainDashboard ? <SiteDropdown sites={sites} /> : <OverviewMenu sites={sites} />}
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {menus.map((menu, idx) => {
              if (menu.menus) {
                return (
                  <SidebarMenu key={idx} title={menu.title}>
                    {menu.menus.map((menu, idx) => {
                      return menu?.items ? (
                        <CollapseItems
                          key={idx}
                          title={menu.title}
                          icon={menu.icon}
                          items={menu.items}
                          path={menu.path!}
                          siteId={menu.siteId}
                        />
                      ) : (
                        <MenuItem key={idx} {...menu} />
                      );
                    })}
                  </SidebarMenu>
                );
              }

              return <MenuItem key={idx} {...menu} />;
            })}
          </div>
          <div className={Sidebar.Footer()}>
            {/* <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip> */}
          </div>
        </div>
      </div>
    </aside>
  );
}
