"use client";

import { showToastResult, useServerAction } from "@/hooks/useServerAction";
import { Button, Divider, Input, Switch } from "@nextui-org/react";
import { ChartSuccess, Global, LockCircle } from "iconsax-react";
import { actionSaveEmailSetting } from "../actions";

export default function FormEmailSettings({
  siteId,
  emailFrom,
  smtpSettings,
  ...props
}: any) {
  const [runAction, isPending] = useServerAction(
    actionSaveEmailSetting,
    showToastResult()
  );
  return (
    <form
      action={async (formData) => {
        await runAction(formData);
      }}
    >
      <div className="flex flex-col gap-2">
        <input type="hidden" name="siteId" value={siteId} />
        <input
          type="hidden"
          name="pathToRevalidate"
          value={`/sites/${siteId}/email`}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Email From"
            variant="bordered"
            name="emailFrom"
            defaultValue={emailFrom}
          />
        </div>
        <Divider />
        <h3 className="col-span-3 text-default-500 text-small">
          SMTP Settings
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              label="Host"
              variant="bordered"
              name="smtpHost"
              defaultValue={smtpSettings?.host || ""}
            />
            <Input
              label="Port"
              type="number"
              variant="bordered"
              name="smtpPort"
              className="max-w-sm"
              defaultValue={smtpSettings?.port || ""}
            />
            <Switch name="smtpSecure" value="yes" defaultSelected={smtpSettings?.secure}>
              Secure
            </Switch>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Username" variant="bordered" name="smtpUsername" defaultValue={smtpSettings?.auth?.user || ""} />
            <Input label="Password" type="password" variant="bordered" name="smtpPassword" defaultValue={smtpSettings?.auth?.pass || ""} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" color="primary" startContent={<ChartSuccess />}>
            {isPending ? "Saving.." : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
