"use client";

import { Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { Add, KeySquare } from "iconsax-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";

export default function Menu() {
  const pathname = usePathname();
  const { push } = useRouter();

  const handleAction = (key: Key) => {
    push(`${key}`);
  };

  return (
    <Listbox aria-label="Actions" variant="flat" onAction={handleAction} selectionMode="single">
      <ListboxItem
        key="/settings"
        description="Another Settings"
        startContent={
          <Add
            size={36}
            className={"/settings" === pathname ? "text-primary-500" : ""}
          />
        }
      >
        Another Settings
      </ListboxItem>
      <ListboxItem
        key="/settings/test"
        description="Another Settings"
        startContent={
          <Add
            size={36}
            className={"/settings/test" === pathname ? "text-primary-500" : ""}
          />
        }
      >
        Another Settings
      </ListboxItem>
      <ListboxSection title="Permissions">
        <ListboxItem
          key="/settings/roles"
          description="Manage custom roles and capabilities"
          className={"/settings/roles" === pathname ? "bg-content1" : ""}
          startContent={
            <KeySquare
              size={36}
              className={
                "/settings/roles" === pathname ? "text-primary-500" : ""
              }
            />
          }
        >
          Custom Roles
        </ListboxItem>
      </ListboxSection>
    </Listbox>
  );
}
