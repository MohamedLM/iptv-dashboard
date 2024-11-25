import NotAllowed from "@/components/NotAllowed";
import { isCurrentUserCan } from "@/utils/server/rbac";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const allowed = await isCurrentUserCan("settings:view");
  if (!allowed) {
    return <NotAllowed />;
  }
  return children;
}
