"use client";

import { useDashboardContext } from "@/contexts/dashboard";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { AddSquare } from "iconsax-react";
import { parseAsString, useQueryState } from "nuqs";
import dynamic from "next/dynamic";
import { RawRole } from "@/types/rbac";
import { defaultRoles } from "@/utils/constants";
const ModalCreateUser = dynamic(() => import("./ModalCreateUser"), {
  ssr: false,
});

export default function AddButton() {
  const { dispatchModal } = useDashboardContext();
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
      <div className="hidden md:block">
        <Select
          items={defaultRoles}
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
          dispatchModal({ type: "open", content: <ModalCreateUser /> })
        }
        startContent={<AddSquare />}
      >
        Add New
      </Button>
    </>
  );
}
