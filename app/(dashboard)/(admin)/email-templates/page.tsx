import Table from "@/components/Table";
import AddButton from "./_components/AddButton";
import RenderCell from "./_components/Cell";
import { SitePageProps } from "@/types/dashboard";
import { getEmailTemplates } from "@/libs/email-templates";

const columns = [
  { name: "Name", key: "name" },
  { name: "Date Created", key: "createdAt" },
  { name: "", key: "actions" },
];

export default async function EmailTemplates({ params, searchParams }: SitePageProps) {
  const data = await getEmailTemplates(
    {
      search: searchParams.s,
    },
    searchParams.page,
    searchParams.pageSize
  );

  // return <pre>{JSON.stringify(data, null, 2)}</pre>

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Email Templates</h3>
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
