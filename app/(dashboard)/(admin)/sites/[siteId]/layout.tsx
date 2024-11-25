import NotAllowed from "@/components/NotAllowed";
import { isCurrentUserCan } from "@/utils/server/rbac";
import Menu from "./_components/Menu";
import { SiteLayoutProps } from "@/types/dashboard";
import { getSite } from "@/libs/site";
import EditSiteProvider from "./provider";

export default async function EditSiteLayout({
  params,
  children,
}: SiteLayoutProps) {
  const allowed = await isCurrentUserCan("sites:edit");
  if (!allowed) {
    return <NotAllowed />;
  }

  const data = await getSite(params.siteId);
  // return <pre>{JSON.stringify(data, null, 2)}</pre>

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">{data?.name}</h3>
      <EditSiteProvider value={data}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Menu />
          <div className="bg-content1 col-span-3 p-4 z-0 flex flex-col relative justify-between gap-4 overflow-auto rounded-large shadow-small w-full">
            {children}
          </div>
        </div>
      </EditSiteProvider>
    </div>
  );
}
