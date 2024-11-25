"use client";

import { useDashboardContext } from "@/contexts/dashboard";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { AddSquare, UserAdd } from "iconsax-react";
import { parseAsString, useQueryState } from "nuqs";
import dynamic from "next/dynamic";
import { RawRole } from "@/types/rbac";
import { defaultRoles } from "@/utils/constants";
import { useEditSiteContext } from "../../provider";

const ModalAddUserToSite = dynamic(() => import("./ModalAddUserToSite"), {
  ssr: false,
});

export default function AddButton({
  users,
}: {
  users: Array<{
    id: string;
    name: string | null;
    image: string | null;
  }>;
}) {
  const { id, name } = useEditSiteContext();
  const { dispatchModal, roles } = useDashboardContext();
  const [role, setRole] = useQueryState(
    "role",
    parseAsString.withDefault("all").withOptions({
      shallow: false,
    })
  );

  const onSelectStatusChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole("all" === e.target.value ? null : e.target.value);
  };

  return (
    <>
      <div>
        <Select
          items={roles}
          placeholder="Role"
          className="w-[150px]"
          onChange={onSelectStatusChanged}
          defaultSelectedKeys={[role]}
        >
          {(role) => <SelectItem key={role.role}>{role.label}</SelectItem>}
        </Select>
      </div>
      <Button
        color="primary"
        onClick={() =>
          dispatchModal({
            type: "open",
            content: <ModalAddUserToSite id={id} name={name} users={users} />,
          })
        }
        startContent={<UserAdd />}
      >
        Add user to site
      </Button>
    </>
  );
}
