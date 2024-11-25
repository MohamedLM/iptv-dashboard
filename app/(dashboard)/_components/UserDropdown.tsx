"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
  User,
} from "@nextui-org/react";
import { Key } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function UserDropdown() {
  const { data } = useSession();
  const router = useRouter();

  const handleDropdownSelect = (actionKey: Key) => {
    console.log({ actionKey });
    switch (actionKey) {
      case "account-settings":
        alert("Todo");
        break;

      case "logout":
        signOut({
          callbackUrl: "/signin",
        });
        break;
    }
  };

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            name={data?.user?.name?.charAt(0)}
            src={data?.user?.image || undefined}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={handleDropdownSelect}
      >
        <DropdownSection className="mb-0" title="Signed in as">
          <DropdownItem
            isReadOnly
            key="profile"
            className="h-14 gap-2 opacity-100"
          >
            <User
              name={data?.user?.name}
              description={data?.user?.email}
              classNames={{
                name: "text-default-600",
                description: "text-default-500",
              }}
              avatarProps={{
                size: "sm",
                name: data?.user?.name?.charAt(0),
                src: data?.user?.image as string,
              }}
            />
          </DropdownItem>
          <DropdownItem key="account-settings" showDivider>
            Account Settings
          </DropdownItem>
          <DropdownItem key="logout" color="danger" className="text-danger">
            Log Out
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
