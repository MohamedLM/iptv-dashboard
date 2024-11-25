import { getSitesLeaderboard } from "@/libs/site";
import SiteCard from "./SiteCard";
import map from "lodash/map";

export default async function TopSellingSites() {
  const data = await getSitesLeaderboard(3);
  // return <pre>{JSON.stringify(data, null, 2)}</pre>
  return (
    <div className="flex flex-col gap-4">
      {map(data, (props) => (
        <SiteCard {...props} />
      ))}
    </div>
  );
}
