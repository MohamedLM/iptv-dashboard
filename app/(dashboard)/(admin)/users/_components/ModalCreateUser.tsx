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
} from "@nextui-org/react";
import { CardTick, PasswordCheck, UserSquare } from "iconsax-react";
import { actionCreateUser } from "../actions";
import { toast } from "sonner";
import { useDashboardContext } from "@/contexts/dashboard";
import { defaultRoles } from "@/utils/constants";

export default function ModalCreateUser() {
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending] = useServerAction(actionCreateUser, (result) => {
    if (result?.success) {
      dispatchModal({ type: "close" });
      toast.success("User created");
    } else {
      toast.error(result?.message || "Failed to create!")
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
          <ModalHeader className="flex flex-col gap-1">
            Create new user
          </ModalHeader>
          <ModalBody>
            <Input
              endContent={
                <UserSquare className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Name"
              variant="bordered"
              name="name"
            />
            <Input
              endContent={
                <CardTick className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Username / Email"
              variant="bordered"
              name="email"
            />
            <Input
              endContent={
                <PasswordCheck className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Password"
              type="password"
              variant="bordered"
              name="password"
            />
            <Select name="role" label="Role">
              {defaultRoles.map((role) => (
                <SelectItem key={role.role}>{role.label}</SelectItem>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {isPending ? "Creating.." : "Create"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}
