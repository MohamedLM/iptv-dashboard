"use client";
import { showToastResult, useServerAction } from "@/hooks/useServerAction";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Divider,
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  Add,
  CloseCircle,
  CloseSquare,
  PasswordCheck,
  UserSquare,
} from "iconsax-react";
import { actionProcessPanelRequest } from "../actions";
import { useSiteContext } from "@/contexts/site";
import { Key, useEffect, useState } from "react";
import { PanelCredential } from "@/libs/order";
import { useDashboardContext } from "@/contexts/dashboard";

const DEFAULT_DURATION = 1;

const InputCredential = ({
  index,
  onDelete,
}: {
  index: Key;
  onDelete: () => void;
}) => {
  return (
    <div className="flex gap-2">
      <Input
        endContent={
          <UserSquare className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Username"
        variant="bordered"
        name={`credentials.${index}.username`}
        required
      />
      <Input
        endContent={
          <PasswordCheck className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Password"
        variant="bordered"
        name={`credentials.${index}.password`}
        required
      />
      <span
        className="text-2xl cursor-pointer text-danger-300"
        onClick={onDelete}
      >
        <CloseSquare />
      </span>
    </div>
  );
};

export default function ModalProcessRequest({ data }: any) {
  const [templates, setTemplates] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isSendEmail, setIsSendEmail] = useState(true);
  const [emailTemplate, setEmailTemplate] = useState<Key>("");
  const { dispatchModal } = useDashboardContext();
  const [credentials, setCredentials] = useState<Array<PanelCredential>>(
    data.credentials || [
      {
        username: "",
        password: "",
      },
    ]
  );
  const { activeSite } = useSiteContext();
  const [runAction, isPending] = useServerAction(
    actionProcessPanelRequest,
    showToastResult({ onSuccess: () => dispatchModal({ type: "close" }) })
  );

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
            formData.set("emailTemplate", String(emailTemplate));
            await runAction(formData);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            Submit Panel Credential
          </ModalHeader>
          <ModalBody>
            <input type="hidden" name="siteId" value={activeSite.id!} />
            <input type="hidden" name="id" value={data.id} />
            <input
              type="hidden"
              name="pathToRevalidate"
              value={`/manage/${activeSite.id}/trials`}
            />
            <div className="flex justify-between">
              <div>Credentials</div>
              <Button
                size="sm"
                onClick={() =>
                  setCredentials((creds) => [
                    ...creds,
                    { username: "", password: "" }, // add new credential field.
                  ])
                }
                startContent={<Add />}
              >
                add more
              </Button>
            </div>
            {credentials.map((c, idx) => (
              <InputCredential
                key={idx}
                index={idx}
                {...c}
                onDelete={() =>
                  setCredentials(credentials.filter((_, i) => i !== idx))
                }
              />
            ))}

            <Divider />
            <div className="flex gap-2">
              <div className="max-w-[200px]">
                <Input
                  label="Duration"
                  variant="bordered"
                  type="number"
                  min={1}
                  name="duration"
                  defaultValue={data.duration || DEFAULT_DURATION}
                  className="max-w-full"
                  endContent={
                    <Select
                      size="sm"
                      className="w-[250px]"
                      name="durationType"
                      defaultSelectedKeys={["day"]}
                    >
                      <SelectItem key="day">Day</SelectItem>
                      <SelectItem key="month">Month</SelectItem>
                    </Select>
                  }
                  required
                />
              </div>
              <div className="col-span-3 flex flex-col gap-1">
                <Checkbox
                  name="sendEmail"
                  value="yes"
                  onValueChange={setIsSendEmail}
                  defaultSelected
                >
                  <span className="text-sm">Send email to user?</span>
                </Checkbox>
                <Checkbox name="autoRemind" value="yes" defaultSelected>
                  <span className="text-sm">Schedule email reminder?</span>
                </Checkbox>
              </div>
            </div>
            {isSendEmail && (
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
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {isPending ? "Processing.." : "Submit"}
            </Button>
          </ModalFooter>
        </form>
      )}
    </ModalContent>
  );
}
