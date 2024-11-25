import { SitePageProps } from "@/types/dashboard";
import FormEmailSettings from "./_components/FormEmailSettings";
import { getSiteSetting, getSiteSmtpSetting } from "@/libs/setting";

export default async function Email({ params }: SitePageProps) {
  const [emailFrom, smtpSettings] = await Promise.all([
    getSiteSetting(params.siteId, "emailFrom", ""),
    getSiteSmtpSetting(params.siteId),
  ]);

  // return <pre>{JSON.stringify(smtpSettings, null, 2)}</pre>;
  return (
    <div className="flex flex-col gap-2 h-full justify-between">
      <h3 className="text-xl font-semibold">Email Settings</h3>
      <FormEmailSettings siteId={params.siteId} emailFrom={emailFrom} smtpSettings={smtpSettings} />
    </div>
  );
}
