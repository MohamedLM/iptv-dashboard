import NotAllowed from "@/components/NotAllowed";
import { isCurrentUserCan } from "@/utils/server/rbac";
import Menu from "./_components/Menu";
import { ReactNode } from "react";

export default async function SettingLayout({
  params,
  children,
}: Readonly<{
  params: { tenantId: string };
  children: ReactNode;
}>) {
  const allowed = await isCurrentUserCan("settings:view");
  if (!allowed) {
    return <NotAllowed />;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Settings</h3>
      <div className="grid grid-cols-4 gap-4">
        <Menu />
        <div className="col-span-3 p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large shadow-small w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
