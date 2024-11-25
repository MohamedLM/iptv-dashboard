import Table from "@/components/Table";
import AddButton from "./_components/AddButton";
import RenderCell from "./_components/Cell";
import { getUsers } from "@/libs/user";
import { getRoles } from "@/utils/server/rbac";
import { RawRole } from "@/types/rbac";
import { SitePageProps } from "@/types/dashboard";

const columns = [
  { name: "Name", key: "name" },
  { name: "Username / Email", key: "email" },
  { name: "Role", key: "role" },
  { name: "", key: "actions" },
];

export default async function Users({ params, searchParams }: SitePageProps) {
  const data = await getUsers(
    {
      search: searchParams.s,
      role: searchParams.role,
    },
    searchParams.page,
    searchParams.pageSize
  );

  // return <pre>{JSON.stringify(data, null, 2)}</pre>

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Users</h3>
      <Table
        columns={columns}
        data={data.rows}
        total={data.total}
        buttonActions={<AddButton />}
        renderCell={RenderCell}
      />
    </div>
  );
}
