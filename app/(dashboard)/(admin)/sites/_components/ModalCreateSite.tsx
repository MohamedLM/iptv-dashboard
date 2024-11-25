"use client";

import { useServerAction } from "@/hooks/useServerAction";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Global, UserSquare } from "iconsax-react";
import { toast } from "sonner";
import { useDashboardContext } from "@/contexts/dashboard";
import { actionCreateSite } from "../actions";
import { useRouter } from "next/navigation";

export default function ModalCreateSite() {
  const { push } = useRouter();
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending] = useServerAction(actionCreateSite, (result) => {
    if (result?.success) {
      dispatchModal({ type: "close" });
      if (result?.redirect) {
        push(result.redirect);
      }
      toast.success(result?.message || "Site created!");
    } else {
      toast.error(result?.message || "Failed to create");
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
          <ModalHeader className="flex flex-col gap-1">Add Site</ModalHeader>
          <ModalBody>
            <input type="hidden" name="pathToRevalidate" value="/sites" />
            <Input
              endContent={
                <Global className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Site Name"
              variant="bordered"
              name="name"
              required
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
}
