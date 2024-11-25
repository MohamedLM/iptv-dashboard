import Table from "@/components/Table";
import { getSiteUsers } from "@/libs/site";
import { SitePageProps } from "@/types/dashboard";
import RenderCell from "./_components/Cell";
import AddButton from "./_components/AddButton";
import { getAllUserOptions } from "@/libs/user";

const columns = [
  { name: "Name", key: "name" },
  { name: "Role", key: "role" },
  { name: "Date Added", key: "createdAt" },
  { name: "", key: "actions" },
];

export default async function Access({ params, searchParams }: SitePageProps) {
  const [data, users] = await Promise.all([
    getSiteUsers(
      params.siteId,
      {
        search: searchParams.s,
        role: searchParams.role,
      },
      searchParams.page,
      searchParams.pageSize
    ),
    getAllUserOptions(),
  ]);

  return (
    <Table
      columns={columns}
      data={data.rows}
      total={data.total}
      buttonActions={<AddButton users={users} />}
      renderCell={RenderCell}
      tableProps={{
        shadow: "none",
        radius: "none",
        classNames: {
          wrapper: "p-0",
        },
      }}
    />
  );
}
