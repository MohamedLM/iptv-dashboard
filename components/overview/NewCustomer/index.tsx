import map from "lodash/map";
import CustomerCard from "./CustomerCard";
import { getCustomerLeaderboard } from "@/libs/customer";

export default async function NewCustomer({ siteId }: { siteId: string }) {
  const data = await getCustomerLeaderboard(siteId, 3)
  // return <pre>{JSON.stringify(data, null,2)}</pre>
  return (
    <div className="flex flex-col gap-4">
      {map(data, (props) => (
        <CustomerCard {...props} />
      ))}
    </div>
  );
}
