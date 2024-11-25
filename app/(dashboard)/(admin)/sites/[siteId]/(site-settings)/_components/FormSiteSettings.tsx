"use client";

import { showToastResult, useServerAction } from "@/hooks/useServerAction";
import {
  Accordion,
  AccordionItem,
  Button,
  Code,
  Input,
} from "@nextui-org/react";
import { ChartSuccess, Global, LockCircle } from "iconsax-react";
import { actionSaveSiteSetting } from "../actions";

export default function FormSiteSettings({ siteId, data, secretKey }: any) {
  const [runAction, isPending] = useServerAction(
    actionSaveSiteSetting,
    showToastResult()
  );
  return (
    <form
      action={async (formData) => {
        await runAction(formData);
      }}
      className="flex flex-col gap-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input type="hidden" name="siteId" value={siteId} />
        <input
          type="hidden"
          name="pathToRevalidate"
          value={`/sites/${siteId}`}
        />
        <Input
          label="Site Name"
          variant="bordered"
          name="name"
          description={`ID: ${data?.id}`}
          defaultValue={data?.name || ""}
          required
          endContent={
            <Global className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
        <Input
          label="Secret Key"
          description="This will be used to validate the API request."
          name="secretKey"
          defaultValue={secretKey || ""}
          endContent={
            <div className=" cursor-pointer">
              <LockCircle className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            </div>
          }
        />
      </div>
      <div>
        <h3 className="text-large font-semibold">Integrations</h3>
        <Accordion isCompact selectionMode="multiple">
          <AccordionItem
            key="elementor"
            aria-label="Elementor Form"
            title="Elementor Form"
          >
            <ul className="list-disc list-inside [&_ul]:list-[revert] [&_li]:py-1">
              <li>
                Create Elementor form with required field ids:
                <span className="ml-6 flex gap-1">
                  <Code>name</Code>
                  <Code>email</Code>
                  <Code>phone</Code>
                  <Code>country</Code>
                  <Code>message</Code>
                </span>
              </li>
              <li>Enable <code>Webhook</code> for <code>Actions After Submit</code></li>
              <li>Add <Code>{`${window.location.origin}/api/webhooks/${data.id}/elementor`}</Code> as the webhook URL</li>
              <li>Enable / Activate the <code>Advanced Data</code></li>
            </ul>
          </AccordionItem>
          <AccordionItem
            key="woocommerce"
            aria-label="WooCommerce Order"
            title="WooCommerce Order"
          >
            <ul className="list-disc list-inside [&_ul]:list-[revert] [&_li]:py-1">
              <li>Install and activate the custom payment plugin</li>
              <li>Go to WooCommerce - Settings - Integration - IPTV Dashboard</li>
              <li>Add <Code>{window.location.origin}</Code> as the <code>Dashboard Domain</code></li>
              <li>Add <Code>{data?.id}</Code> as the <code>Site ID</code></li>
              <li>Add <Code>{secretKey}</Code> as the <code>Secret Key</code></li>
            </ul>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="flex justify-end">
        <Button type="submit" color="primary" startContent={<ChartSuccess />}>
          {isPending ? "Saving.." : "Save"}
        </Button>
      </div>
    </form>
  );
}
