import { getSite } from "@/libs/site";
import { SitePageProps } from "@/types/dashboard";
import { Button, Input } from "@nextui-org/react";
import { ChartSuccess, Copy, Global, UserSquare } from "iconsax-react";
import FormSiteSettings from "./_components/FormSiteSettings";
import { getSiteSetting } from "@/libs/setting";

export default async function Settings({ params }: SitePageProps) {
  const [data, secretKey] = await Promise.all([
    getSite(params.siteId),
    getSiteSetting(params.siteId, "secretKey", params.siteId),
  ]);
  return (
    <div className="flex flex-col gap-2 h-full justify-between">
      <h3 className="text-xl font-semibold">Site Settings</h3>
      <FormSiteSettings siteId={params.siteId} data={data} secretKey={secretKey} />
    </div>
  );
}
