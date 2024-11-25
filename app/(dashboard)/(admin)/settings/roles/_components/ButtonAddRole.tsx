"use client";

import { useDashboardContext } from "@/contexts/dashboard";
import {
  Button,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { AddCircle, Key } from "iconsax-react";
import { actionCreateRole } from "../actions";
import { useServerAction } from "@/hooks/useServerAction";
import { toast } from "sonner";

const ModalCreateRole = () => {
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending] = useServerAction(actionCreateRole, (result) => {
    if (result?.error) {
      alert(JSON.stringify(result));
    } else {
      dispatchModal({ type: "close" });
      toast("Role created");
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
            Create new role
          </ModalHeader>
          <ModalBody>
            <Input
              endContent={
                <Key className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Role name"
              variant="bordered"
              name="name"
            />
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
};

export default function ButtonAddRole() {
  const { dispatchModal } = useDashboardContext();
  return (
    <Button
      size="sm"
      onClick={() =>
        dispatchModal({ type: "open", content: <ModalCreateRole /> })
      }
      startContent={<AddCircle size={18} />}
    >
      Add new role
    </Button>
  );
}
