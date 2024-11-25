"use client";
import { useServerAction } from "@/hooks/useServerAction";
import { RawRole } from "@/types/rbac";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { CardTick, PasswordCheck, UserSquare } from "iconsax-react";
import { toast } from "sonner";
import { useDashboardContext } from "@/contexts/dashboard";
import { defaultRoles } from "@/utils/constants";
import { actionEditUser } from "../actions";
import { useState } from "react";

export default function ModalEditUser({ data }: any) {
  const [changePassword, setChangePassword] = useState(false);
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending] = useServerAction(actionEditUser, (result) => {
    if (result?.success) {
      dispatchModal({ type: "close" });
      toast.success(result?.message || "User updated!");
    } else {
      toast.error(result?.message || "Failed to create!");
      console.log(result)
    }
  });

  return (
    <ModalContent>
      {(onClose) => (
        <form
          action={async (formData) => {
            await runAction(formData);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">Edit User</ModalHeader>
          <ModalBody>
            <input type="hidden" name="userId" value={data.id} />
            <Input
              endContent={
                <UserSquare className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              defaultValue={data.name || ""}
              label="Name"
              variant="bordered"
              name="name"
            />
            <Select name="role" label="Role" defaultSelectedKeys={[data.role]}>
              {defaultRoles.map((role) => (
                <SelectItem key={role.role}>{role.label}</SelectItem>
              ))}
            </Select>

            <Switch
              name="changePassword"
              value="true"
              onValueChange={setChangePassword}
            >
              Change Password?
            </Switch>

            {changePassword && (
              <div className="flex gap-2 mt-2">
                <Input
                  endContent={
                    <PasswordCheck className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  type="password"
                  variant="bordered"
                  name="password"
                />
                <Input
                  endContent={
                    <PasswordCheck className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Confirm Password"
                  type="password"
                  variant="bordered"
                  name="confirmPassword"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {isPending ? "Updating.." : "Update"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}
