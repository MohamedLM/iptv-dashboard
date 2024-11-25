"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { Add, Global, Key as KeyIcon, MessageProgramming, RecoveryConvert } from "iconsax-react";
import { usePathname, useRouter } from "next/navigation";
import { Key } from "react";
import { useEditSiteContext } from "../provider";
import map from "lodash/map";

const MENUS = [
  {
    key: "",
    label: "Site Settings",
    description: "General settings",
    icon: Global,
  },
  {
    key: "/email",
    label: "Email Settings",
    description: "Email template settings",
    icon: MessageProgramming,
  },
  {
    key: "/access",
    label: "Access Controls",
    description: "Manage user and permissions",
    icon: KeyIcon,
  },
  {
    key: "/import",
    label: "Import Data",
    description: "Import order data from CSV",
    icon: RecoveryConvert,
  },
];

export default function Menu() {
  const pathname = usePathname();
  const { id } = useEditSiteContext();
  const { push } = useRouter();
  const [_, settingPath] = pathname.split(`/${id}`);

  const handleAction = (key: Key) => {
    push(`/sites/${id}${key}`);
  };

  return (
    <Listbox
      aria-label="Actions"
      variant="flat"
      onAction={handleAction}
      selectionMode="single"
    >
      <ListboxSection title="Settings">
        {map(MENUS, (menu) => {
          const isActive = settingPath === menu.key;
          return (
            <ListboxItem
              className="py-2"
              key={menu.key}
              description={menu.description}
              startContent={
                <menu.icon
                  size={36}
                  className={isActive ? "text-primary-500" : ""}
                />
              }
            >
              {menu.label}
            </ListboxItem>
          );
        })}
      </ListboxSection>
    </Listbox>
  );
}
