"use client";
import { useDashboardContext } from "@/contexts/dashboard";
import { SiteData } from "@/contexts/site";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import clsx from "clsx";
import { FavoriteChart } from "iconsax-react";
import map from "lodash/map";
import { usePathname, useRouter } from "next/navigation";

export default function OverviewMenu({ sites }: { sites?: Array<SiteData> }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useDashboardContext();
  const { push } = useRouter();

  return (
    <Dropdown
      classNames={{
        base: "w-full min-w-[260px]",
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div
          className={clsx(
            "flex items-center gap-2 cursor-pointer w-full",
            "/" === pathname ? "[&_svg_path]:fill-primary-500" : ""
          )}
        >
          <FavoriteChart size={42} variant="Broken" />
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              Overview
            </h3>
            <span className="text-xs font-medium text-default-500">
              All sites
            </span>
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(siteId) => {
          sidebarOpen && toggleSidebar();
          if ("main" === siteId) {
            push(`/`);
          } else {
            push(`/manage/${siteId}`);
          }
        }}
        aria-label="Avatar Actions"
      >
        <DropdownItem
          key="main"
          className="text-primary"
          color="primary"
          description="Show overview for all sites"
          startContent={<FavoriteChart size={32} />}
        >
          Overview
        </DropdownItem>
        <DropdownSection className="mb-0" title="Sites">
          {map(sites, (site) => (
            <DropdownItem key={site.id!}>
              <User
                name={site.name}
                description={site.id}
                avatarProps={{
                  name: site?.name ? site.name.charAt(0) : "",
                  radius: "md",
                }}
              />
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
