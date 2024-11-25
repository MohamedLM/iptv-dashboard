"use client";

import { Button } from "@nextui-org/react";
import RoleTable from "./RoleTable";
import ButtonAddRole from "./ButtonAddRole";
import { useServerAction } from "@/hooks/useServerAction";
import { actionSaveRolePermissions } from "../actions";
import { MappedRole } from "@/types/rbac";
import { toast } from "sonner"

interface Props {
  roles: MappedRole[];
}

export default function RoleForm({ roles }: Props) {
  const [runAction, isPending] = useServerAction(
    actionSaveRolePermissions,
    (result) => {
      toast.success("Permission updated!");
    }
  );

  return (
    <form
      className="flex flex-col gap-4"
      action={async (formData) => {
        await runAction(formData);
      }}
    >
      <RoleTable roles={roles} />
      <div className="flex justify-between">
        <ButtonAddRole />
        <Button type="submit" color="primary">
          {isPending ? `Saving...` : `Save`}
        </Button>
      </div>
    </form>
  );
}
