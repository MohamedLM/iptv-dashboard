import Table from "@/components/Table";
import { SitePageProps } from "@/types/dashboard";
import RenderCell from "./_components/Cell";
import { getOrders } from "@/libs/order";
import { isCurrentSiteUserCan } from "@/utils/server/rbac";
import ActionButtons from "./_components/ActionButtons";
import { getActualStartEndDate } from "@/utils/date";

const columns = [
  { name: "Customer", key: "customer" },
  { name: "Phone", key: "phone" },
  { name: "Product Name", key: "product" },
  { name: "Order Status", key: "status" },
  { name: "Amount", key: "amount" },
  { name: "Tags", key: "tags" },
  { name: "Date Requested", key: "createdAt" },
  { name: "Last Updated", key: "updatedAt" },
  // { name: "", key: "actions" },
  // { name: "Metadata", key: "metadata" },
  // { name: "", key: "actions" },
];

export default async function Orders({ params, searchParams }: SitePageProps) {
  let requestDateRange = undefined;
  if (searchParams.requestDate) {
    const { startDate, endDate } = getActualStartEndDate(
      searchParams.requestDate
    );
    requestDateRange = {
      from: startDate,
      to: endDate,
    };
  }

  const [data, canEdit] = await Promise.all([
    getOrders(
      params.siteId,
      {
        search: searchParams.s,
        type: "paid",
        completed: false,
        requestDateRange,
      },
      searchParams.page,
      searchParams.pageSize
    ),
    isCurrentSiteUserCan(params.siteId, "orders:edit"),
  ]);

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Orders</h3>
      <Table
        columns={columns}
        defaultVisibleColumns={[
          "customer",
          "phone",
          "product",
          "status",
          "amount",
          "tags",
          "updatedAt",
          "actions",
        ]}
        data={data.rows}
        total={data.total}
        buttonActions={<ActionButtons />}
        renderCell={RenderCell}
        canEdit={canEdit}
      />
    </div>
  );
}
