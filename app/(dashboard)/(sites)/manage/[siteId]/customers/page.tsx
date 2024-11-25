import Table from "@/components/Table";
import { getCustomers } from "@/libs/customer";
import { SitePageProps } from "@/types/dashboard";
import RenderCell from "./_components/Cell";
import { isCurrentSiteUserCan } from "@/utils/server/rbac";
import CustomerTable from "./_components/CustomerTable";

const columns = [
  { name: "Customer Name", key: "name" },
  { name: "Phone", key: "phone" },
  { name: "Paid", key: "paidOrder" },
  { name: "Trial", key: "trialOrder" },
  { name: "Abandoned", key: "abandonedOrder" },
  { name: "Expired", key: "expiredOrder" },
  { name: "Tags", key: "tags" },
  { name: "Date Created", key: "createdAt" },
  // { name: "", key: "actions" },
];

export default async function Customers({
  params,
  searchParams,
}: SitePageProps) {
  const [data, canEdit] = await Promise.all([
    getCustomers(
      params.siteId,
      {
        search: searchParams.s,
        orderStatus: searchParams.filterOrder,
      },
      1,
      100000000000000
    ),
    isCurrentSiteUserCan(params.siteId, "customers:edit"),
  ]);

  // return <pre>{JSON.stringify(data, null, 2)}</pre>
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Customers</h3>
      <CustomerTable data={data.rows} siteId={params.siteId} canEdit={canEdit} />
    </div>
  );
}
