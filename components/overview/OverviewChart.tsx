"use client";
import { ChartData } from "@/libs/timeseries";
import { nFormat } from "@/utils/currency";
import { getStartEndDate, startEndDateMap } from "@/utils/date";
import { Select, SelectItem } from "@nextui-org/react";
import { sumBy } from "lodash";
import map from "lodash/map";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import Chart, { Props } from "react-apexcharts";

const generateOptions = (
  data: Array<ChartData | boolean>,
  theme?: string
): Props["options"] => {
  return {
    chart: {
      type: "area",
      animations: {
        easing: "linear",
        speed: 300,
      },
      sparkline: {
        enabled: false,
      },
      brush: {
        enabled: false,
      },
      id: "basic-bar",
      foreColor: "hsl(var(--nextui-default-800))",
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    xaxis: {
      categories: map(data, "date"),
      labels: {
        // show: false,
        style: {
          colors: "hsl(var(--nextui-default-800))",
        },
      },
      axisBorder: {
        color: "hsl(var(--nextui-nextui-default-200))",
      },
      axisTicks: {
        color: "hsl(var(--nextui-nextui-default-200))",
      },
    },
    yaxis: {
      // stepSize: 1,
      labels: {
        style: {
          // hsl(var(--nextui-content1-foreground))
          colors: "hsl(var(--nextui-default-800))",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: theme,
    },
    grid: {
      show: true,
      borderColor: "hsl(var(--nextui-default-200))",
      strokeDashArray: 0,
      position: "back",
    },
    stroke: {
      curve: "smooth",
      fill: {
        colors: ["red"],
      },
    },
    // @ts-ignore
    // markers: false,
  };
};

const periods = map(startEndDateMap, (o, key) => {
  // omit some options and map the key
  return !["yearToDate", "lifetime"].includes(key) && { key, label: o.label };
}).filter(Boolean) as Array<{ key: string; label: string }>;

interface LeaderBoardData {
  revenue: number;
  paid: number;
  trial: number;
  draft: number;
}

export default function OverviewChart({
  period,
  site,
}: {
  period: keyof typeof startEndDateMap;
  site?: string;
}) {
  const [activePeriod, setActivePeriod] =
    useState<keyof typeof startEndDateMap>(period);
  const [data, setData] = useState<[any, LeaderBoardData]>([
    null,
    { revenue: 0, paid: 0, trial: 0, draft: 0 },
  ]);
  const [chartData, leaderBoardData] = data;
  const { theme } = useTheme();

  const { options, series }: Props = useMemo(() => {
    const options = generateOptions(chartData, theme);
    const series = [
      {
        name: "Trial Panels",
        data: map(chartData, "trial"),
      },
      {
        name: "Paid Panels",
        data: map(chartData, "paid"),
      },
    ];

    return { series, options };
  }, [chartData, theme]);

  const counts = useMemo(() => {
    return {
      paid: sumBy(chartData, "paid"),
      trial: sumBy(chartData, "trial"),
    };
  }, [chartData]);

  useEffect(() => {
    // console.log("activePeriod", activePeriod);
    const { startDate, endDate } = getStartEndDate(activePeriod);

    const params = new URLSearchParams({
      from: startDate,
      to: endDate,
      ...(site && { site }), // Only include site if it's defined
    });

    // alert(`fetch new data for ${startDate} - ${endDate}`);
    fetch(`/api/chart?${params.toString()}`)
      .then((res) => res.json())
      .then(setData);
  }, [activePeriod]);

  return (
    <>
      <div className="flex justify-between mb-5">
        <div className="hidden md:grid gap-4 grid-cols-2">
          <div>
            <h5 className="inline-flex items-center leading-none font-normal mb-2">
              Trial Panels
            </h5>
            <p className="text-2xl leading-none font-bold">{counts.trial}</p>
          </div>
          <div>
            <h5 className="inline-flex items-center leading-none font-normal mb-2">
              Paid Panels
            </h5>
            <p className="text-2xl leading-none font-bold">{counts.paid}</p>
          </div>
        </div>
        <div>
          <Select
            items={periods}
            label="Period"
            placeholder="Change period"
            className="min-w-[150px]"
            size="sm"
            defaultSelectedKeys={[activePeriod]}
            onChange={(e) =>
              setActivePeriod(e.target.value as keyof typeof startEndDateMap)
            }
            disallowEmptySelection
          >
            {(item) => (
              <SelectItem key={`${item.key}`}>{item.label}</SelectItem>
            )}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6">
        <div className="lg:col-span-2 xl:col-span-1 flex flex-col h-full gap-2">
          <div className="bg-content1 rounded-lg shadow-small border hover:border-primary p-2 flex flex-col gap-1">
            <div className="text-default-400 text-md">Total Revenue</div>
            <div className="font-bold text-xl">
              {nFormat(leaderBoardData.revenue)}
            </div>
          </div>
          <div className="bg-content1 rounded-lg shadow-small border hover:border-primary p-2 flex flex-col gap-1">
            <div className="text-default-400 text-md">Total Paid</div>
            <div className="font-bold text-xl">{leaderBoardData.paid}</div>
          </div>
          <div className="bg-content1 rounded-lg shadow-small border hover:border-primary p-2 flex flex-col gap-1">
            <div className="text-default-400 text-md">Total Trial</div>
            <div className="font-bold text-xl">{leaderBoardData.trial}</div>
          </div>
          <div className="bg-content1 rounded-lg shadow-small border hover:border-primary p-2 flex flex-col gap-1">
            <div className="text-default-400 text-md">Total Abandoned</div>
            <div className="font-bold text-xl">{leaderBoardData.draft}</div>
          </div>
        </div>
        <Chart
          className="lg:col-span-4 xl:col-span-5"
          options={options}
          series={series}
          type="line"
          width="100%"
          height={400}
        />
      </div>
    </>
  );
}
