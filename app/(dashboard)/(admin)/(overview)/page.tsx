import { auth } from "@/auth";
import { ChartData, getChartData } from "@/libs/timeseries";
import { getStartEndDate } from "@/utils/date";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageProps } from "@/types/dashboard";
import TopSellingSites from "@/components/overview/TopSellingSites";
import Loading from "@/components/Loading";

const OverviewChart = dynamic(
  () => import("@/components/overview/OverviewChart"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();

  return (
    <div className="h-full flex flex-col gap-6 lg:px-6">
      <div>
        <div className="text-3xl">{`Welcome back, ${
          session?.user?.name || "friend"
        }!`}</div>
        <p className="text-md opacity-75">
          Here&apos;s the overview of the sites
        </p>
      </div>

      <div className="flex justify-center gap-8 flex-wrap xl:flex-nowrap max-w-[90rem] mx-auto w-full">
        <div className="gap-3 flex flex-col w-full">
          <OverviewChart period="thisWeek" />
        </div>

        <div className="gap-3 flex flex-col xl:max-w-xs w-full">
          <h3 className="text-center text-xl font-semibold">
            Top Selling Sites
          </h3>
          <Suspense fallback={<Loading />}>
            <TopSellingSites />
          </Suspense>
        </div>
      </div>

      {/* <div className="flex flex-col justify-center w-full py-5 max-w-[90rem] mx-auto gap-3">
        <div className="flex  flex-wrap justify-between">
          <h3 className="text-xl font-semibold">Unprocessed Credential Requests</h3>
        </div>
        <Suspense fallback={<Loading />}>
          <UnprocessedPanels
            siteId={null}
            canEdit={true}
            page={searchParams.page}
          />
        </Suspense>
      </div> */}
    </div>
  );
}
