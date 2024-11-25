import db from "@/database";
import { sql } from "drizzle-orm";
import map from "lodash/map";
import first from "lodash/first";
import toInteger from "lodash/toInteger";
import mapValues from "lodash/mapValues";

export type ChartData = {
  date: string;
  trial: number;
  paid: number;
};

export const getChartData = async (
  from: string,
  to: string,
  siteId?: string
): Promise<
  [
    Array<ChartData | boolean>,
    { paid: number; trial: number; draft: number; revenue: number }
  ]
> => {
  const where = siteId ? sql`AND orders.site_id = ${siteId}` : sql`AND true`;
  const stmtChart = sql`
    WITH date_series AS (
        SELECT
            generate_series(
                '${sql.raw(from)}' :: date,
                '${sql.raw(to)}' :: date,
                '1 day' :: INTERVAL
            ) :: date AS date
    )
    SELECT
        date_series.date,
        COALESCE(trial_orders.count, 0) AS trial,
        COALESCE(paid_orders.count, 0) AS paid
    FROM
        date_series
        LEFT JOIN (
            SELECT
                DATE(created_at) AS date,
                COUNT(*) AS count
            FROM
                orders
            WHERE
                orders.type = 'trial'
                ${where}
            GROUP BY
                DATE(created_at)
        ) AS trial_orders ON date_series.date = trial_orders.date
        LEFT JOIN (
            SELECT
                DATE(created_at) AS date,
                COUNT(*) AS count
            FROM
                orders
            WHERE
                orders.type = 'paid'
                AND orders.status IN ('processing', 'completed')
                ${where}
            GROUP BY
                DATE(created_at)
        ) AS paid_orders ON date_series.date = paid_orders.date
    ORDER BY
        date_series.date;
  `;

  const stmtLeaderboard = sql`
    SELECT
        COUNT(DISTINCT paid_order.id) AS paid,
        COUNT(DISTINCT trial_order.id) AS trial,
        COUNT(DISTINCT draft_order.id) AS draft,
        COALESCE(SUM(paid_order.amount), 0) AS revenue
    FROM
        orders AS orders
        LEFT JOIN orders paid_order ON (
            paid_order.id = orders.id
            AND paid_order.type = 'paid'
            AND paid_order.status IN ('processing', 'completed')
        )
        LEFT JOIN orders trial_order ON (
            trial_order.id = orders.id
            AND trial_order.type = 'trial'
        )
        LEFT JOIN orders draft_order ON (
            draft_order.id = orders.id
            AND draft_order.type = 'paid'
            AND draft_order.status NOT IN ('processing', 'completed')
        )
    WHERE
        DATE(orders.created_at) >= '${sql.raw(from)}'
        AND DATE(orders.created_at) <= '${sql.raw(to)}'
        ${where}
  `;

  return Promise.all([
    db.execute(stmtChart).then((result) => {
      return map(result, (d: ChartData) => ({
        date: d.date,
        trial: toInteger(d.trial),
        paid: toInteger(d.paid),
      }));
    }),
    db
      .execute(stmtLeaderboard)
      .then(first)
      .then((data) => ({
        paid: toInteger(data?.paid || 0),
        trial: toInteger(data?.trial || 0),
        draft: toInteger(data?.draft || 0),
        revenue: toInteger(data?.revenue || 0),
      })),
  ]);
};
