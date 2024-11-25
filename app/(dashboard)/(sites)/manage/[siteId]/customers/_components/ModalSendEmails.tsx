"use client";
import { useDashboardContext } from "@/contexts/dashboard";
import { useServerAction } from "@/hooks/useServerAction";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";
import { actionSendEmails } from "../actions";
import { Key, useEffect, useState } from "react";

export default function ModalSendEmails({
  siteId,
  data,
}: {
  siteId: string;
  data: any;
}) {
  const { dispatchModal } = useDashboardContext();
  const [runAction, isPending] = useServerAction(actionSendEmails, (result) => {
    if (result?.success) {
      dispatchModal({ type: "close" });
      toast.success(result?.message || "Email sent!");
    } else {
      toast.error(result?.message || "Failed to send email");
    }
  });

  const [emailTemplate, setEmailTemplate] = useState<Key>("");
  const [templates, setTemplates] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    fetch(`/api/email-template-options`)
      .then((res) => res.json())
      .then((templates: Array<{ id: string; name: string }>) => {
        setTemplates(templates);
      });
  }, []);

  return (
    <ModalContent>
      {(onClose) => (
        <form
          action={async (formData) => {
            formData.set("siteId", siteId);
            formData.set("emailTemplate", String(emailTemplate));
            formData.set("jsonEmails", JSON.stringify(data));
            await runAction(formData);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">Send Emails</ModalHeader>
          <ModalBody>
            <Autocomplete
              label="Select email template"
              className="w-full"
              selectedKey={emailTemplate as string}
              onSelectionChange={(key) => setEmailTemplate(key as Key)}
            >
              {templates.map((template) => (
                <AutocompleteItem key={template.id} value={template.id}>
                  {template.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {isPending ? "Sending.." : "Send"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}
