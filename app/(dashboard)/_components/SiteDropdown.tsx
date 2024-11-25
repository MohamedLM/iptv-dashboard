"use client";

import { Home, ShopAdd } from "iconsax-react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import map from "lodash/map";
import { useRouter } from "next/navigation";
import { SiteData, useSiteContext } from "@/contexts/site";
import { useDashboardContext } from "@/contexts/dashboard";

export default function SiteDropdown({ sites }: { sites?: Array<SiteData> }) {
  const { push } = useRouter();
  const { activeSite } = useSiteContext();
  const { role } = useDashboardContext();
  const isAdmin = "admin" === role;

  return (
    <Dropdown
      classNames={{
        base: "w-full min-w-[260px]",
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-4">
          <Avatar name={activeSite?.name?.charAt(0)} isBordered radius="lg" />
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              {activeSite?.name}
            </h3>
            <span className="text-xs font-medium text-default-500">
              {activeSite?.id}
            </span>
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(siteId) => {
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
          className={isAdmin ? "text-primary" : "hidden"}
          color="primary"
          description="Back to main dashboard"
          startContent={<Home size={32} />}
        >
          Main Dashboard
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
