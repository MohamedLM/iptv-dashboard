"use client";

import { Button } from "@nextui-org/react";
import RoleTable from "./RoleTable";
import { useServerAction } from "@/hooks/useServerAction";
import { actionSaveRolePermissions } from "../actions";
import { MappedRole } from "@/types/rbac";
import { toast } from "sonner";
import { AddCircle } from "iconsax-react";
import { useDashboardContext } from "@/contexts/dashboard";
import ModalCreateRole from "./ModalCreateRole";

interface Props {
  roles: MappedRole[];
}

export default function RoleForm({ roles }: Props) {
  const { dispatchModal } = useDashboardContext();
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
      <div className="grid grid-cols-1">
        <RoleTable roles={roles} />
      </div>
      <div className="flex justify-between">
        <Button
          onClick={() =>
            dispatchModal({ type: "open", content: <ModalCreateRole /> })
          }
          startContent={<AddCircle size={18} />}
        >
          Add new role
        </Button>
        <Button type="submit" color="primary">
          {isPending ? `Saving...` : `Save`}
        </Button>
      </div>
    </form>
  );
}
