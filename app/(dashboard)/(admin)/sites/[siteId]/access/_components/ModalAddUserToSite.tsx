"use client";
import { useServerAction } from "@/hooks/useServerAction";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import { toast } from "sonner";
import { useDashboardContext } from "@/contexts/dashboard";
import { actionAddUserToSite } from "../actions";

export default function ModalAddUserToSite({
  id,
  name,
  users,
}: {
  id: string;
  name: string;
  users: Array<{ id: string; name: string | null; image: string | null }>;
}) {
  const { dispatchModal, roles } = useDashboardContext();
  const [runAction, isPending] = useServerAction(
    actionAddUserToSite,
    (result) => {
      if (result?.success) {
        dispatchModal({ type: "close" });
        toast.success(result?.message || "User added.");
      } else {
        toast.error(result?.message || "Something went wrong!");
      }
    }
  );

  return (
    <ModalContent>
      {(onClose) => (
        <form
          action={async (formData) => {
            await runAction(formData);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            {`Add user to ${name}`}
          </ModalHeader>
          <ModalBody>
            <input type="hidden" name="siteId" value={id} />
            <input
              type="hidden"
              name="pathToRevalidate"
              value={`/sites/${id}/access`}
            />
            <Select name="userId" label="Select User">
              {users.map((user) => (
                <SelectItem
                  key={user.id}
                  startContent={
                    <Avatar
                      alt={user.name || ""}
                      className="w-6 h-6"
                      src={user.image || ""}
                    />
                  }
                >
                  {user.name}
                </SelectItem>
              ))}
            </Select>
            <Select name="role" label="Role">
              {roles.map((role) => (
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
