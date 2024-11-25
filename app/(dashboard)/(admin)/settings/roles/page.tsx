import { getRolesWithCapabilites } from "@/utils/server/rbac";
import RoleForm from "./_components/RoleForm";

export default async function Roles() {
  const roles = await getRolesWithCapabilites();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg">Manage Role Permissions</h3>
      <RoleForm roles={roles} />
    </div>
  );
}
