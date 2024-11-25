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
import { Global, Send2, UserSquare } from "iconsax-react";
import { toast } from "sonner";
import { useDashboardContext } from "@/contexts/dashboard";
import { actionCreateTemplate } from "../actions";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useState } from "react";

export default function ModalCreate() {
  const [markdown, setMarkdown] = useState("");
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending] = useServerAction(
    actionCreateTemplate,
    (result) => {
      if (result?.success) {
        dispatchModal({ type: "close" });
        toast.success(result?.message || "Template created!");
      } else {
        toast.error(result?.message || "Failed to create");
      }
    }
  );

  return (
    <ModalContent>
      {(onClose) => (
        <form
          action={async (formData) => {
            formData.set("content", markdown);
            await runAction(formData);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            Add Template
          </ModalHeader>
          <ModalBody>
            <input
              type="hidden"
              name="pathToRevalidate"
              value="/email-templates"
            />
            <Input
              endContent={
                <Global className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Template Name"
              variant="bordered"
              name="name"
              required
            />
            <Input
              endContent={
                <Send2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              label="Subject"
              variant="bordered"
              name="subject"
              required
            />
            <MarkdownEditor markdown={markdown} onChange={setMarkdown} />
            <div className="text-sm">
              Available placeholder: <code>{`{name}, {username1}, {password1}`}</code>
            </div>
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
