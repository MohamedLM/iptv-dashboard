import Table from "@/components/Table";
import { SitePageProps } from "@/types/dashboard";
import RenderCell from "../_components/Cell";
import { getOrders } from "@/libs/order";
import { isCurrentSiteUserCan } from "@/utils/server/rbac";
import ActionButtons from "../_components/ActionButtons";
import { getActualStartEndDate } from "@/utils/date";

const columns = [
  { name: "Customer", key: "customer" },
  { name: "Phone", key: "phone" },
  { name: "Credentials", key: "credentials" },
  { name: "Expiration", key: "expiration", sortable: true },
  { name: "Email Status", key: "emailStatus" },
  { name: "Tags", key: "tags" },
  { name: "Date Requested", key: "createdAt" },
  { name: "Last Updated", key: "updatedAt" },
  { name: "", key: "actions" },
];

export default async function Trials({ params, searchParams }: SitePageProps) {
  let sort = undefined;
  if (searchParams.sort) {
    const [col, dir] = searchParams.sort.split("--");
    sort = {
      column: "expiration" === col ? "expired_at" : col,
      direction: dir,
    };
  }

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
        type: "trial",
        sort,
        credentialStatus: searchParams.credential,
        requestDateRange,
      },
      searchParams.page,
      searchParams.pageSize
    ),
    isCurrentSiteUserCan(params.siteId, "trials:edit"),
  ]);

  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold">Trial Requests</h3>
      <Table
        columns={columns}
        defaultVisibleColumns={[
          "customer",
          "phone",
          "credentials",
          "expiration",
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
