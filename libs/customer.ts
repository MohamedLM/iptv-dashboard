import db, { withPagination } from "@/database";
import {
  InsertCustomer,
  SelectCustomer,
  customers,
  objectTags,
  orders,
  tags,
} from "@/database/schema";
import {
  aliasedTable,
  and,
  desc,
  eq,
  getTableColumns,
  gt,
  ilike,
  inArray,
  lt,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import first from "lodash/first";
import { COMPLETED_STATUSES } from "./order";

interface GetCustomers {
  rows: Array<SelectCustomer & { tags: string }>;
  total: number;
}

export const getCustomers = async (
  siteId: string,
  filter?: {
    search?: string;
    orderStatus?: string;
  },
  page?: number,
  pageSize?: number
): Promise<GetCustomers> => {
  const trialOrder = aliasedTable(orders, "trialOrder");
  const paidOrder = aliasedTable(orders, "paidOrder");
  const abandonedOrder = aliasedTable(orders, "abandonedOrder");
  const expiredOrder = aliasedTable(orders, "expiredOrder");

  const query = db
    .select({
      ...getTableColumns(customers),
      paidOrder: sql<number>`cast(count(${paidOrder.id}) as int)`,
      trialOrder: sql<number>`cast(count(${trialOrder.id}) as int)`,
      abandonedOrder: sql<number>`cast(count(${abandonedOrder.id}) as int)`,
      expiredOrder: sql<number>`cast(count(${expiredOrder.id}) as int)`,
      tags: sql`JSON_AGG(
        json_build_object(
            'id',
            tags.id,
            'name',
            tags.name,
            'color',
            tags.color
          )
        ) FILTER (
            WHERE
                tags.name IS NOT NULL
        ) AS tags`,
    })
    .from(customers)
    .leftJoin(objectTags, eq(objectTags.objectId, customers.id))
    .leftJoin(tags, eq(tags.id, objectTags.tagId))
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .leftJoin(
      paidOrder,
      and(
        eq(paidOrder.id, orders.id),
        eq(paidOrder.type, "paid"),
        inArray(paidOrder.status, COMPLETED_STATUSES)
      )
    )
    .leftJoin(
      abandonedOrder,
      and(
        eq(abandonedOrder.id, orders.id),
        eq(abandonedOrder.type, "paid"),
        notInArray(abandonedOrder.status, COMPLETED_STATUSES)
      )
    )
    .leftJoin(
      trialOrder,
      and(eq(trialOrder.id, orders.id), eq(trialOrder.type, "trial"))
    )
    .leftJoin(
      expiredOrder,
      and(
        eq(expiredOrder.id, orders.id),
        lt(expiredOrder.expiredAt, new Date())
      )
    )
    .where(
      and(
        eq(customers.siteId, siteId),
        filter?.search
          ? or(
              ilike(customers.name, `%${filter.search}%`),
              ilike(customers.email, `%${filter.search}%`),
              ilike(tags.name, `%${filter.search}%`)
            )
          : undefined
      )
    )
    .groupBy(customers.id)
    .having(
      filter?.orderStatus
        ? ({ trialOrder, paidOrder, abandonedOrder, expiredOrder }) => {
            switch (filter?.orderStatus) {
              case "paid":
                return gt(paidOrder, 0);
              case "trial":
                return gt(trialOrder, 0);
              case "abandoned":
                return gt(abandonedOrder, 0);
              case "expired":
                return gt(expiredOrder, 0);
            }
          }
        : undefined
    );
  // .having(({ trialOrder, paidOrder }) =>
  //   and(gt(trialOrder, 0), undefined)
  // );

  // return query.toSQL();

  return withPagination(db, query, desc(customers.createdAt), page, pageSize);
};

export const getCustomerTimeline = async (customerId: string) => {
  const stmt = sql`
    SELECT
        'Register to the site' AS TYPE,
        id,
        created_at
    FROM
        customers
    WHERE
        customers.id = ${customerId}
    UNION
    ALL
    SELECT
        'Request trial',
        id,
        created_at
    FROM
        orders
    WHERE
        orders.customer_id = ${customerId} AND orders.type = 'trial'
    UNION
    ALL
    SELECT
        CONCAT('Subscription paid', ': ', orders.site_order_id),
        id,
        created_at
    FROM
        orders
    WHERE
        orders.customer_id = ${customerId} AND orders.type = 'paid' AND orders.status IN ('processing', 'completed')
    ORDER BY
        created_at DESC;
  `;

  return db.execute(stmt);
};

export const getCustomerLeaderboard = async (siteId: string, limit: number) => {
  // const where = siteId ? sql`AND panels.site_id = ${siteId}` : sql`AND true`;
  const stmt = sql`
    SELECT
      c.*,
      COUNT(DISTINCT trial_orders.id) AS trial,
      COUNT(DISTINCT paid_orders.id) AS paid,
      COALESCE(t.total_spent, 0) as spent
    FROM
      customers c
      LEFT JOIN orders trial_orders ON c.id = trial_orders.customer_id AND trial_orders.type = 'trial'
      LEFT JOIN orders paid_orders ON c.id = paid_orders.customer_id AND paid_orders.type = 'paid' AND paid_orders.status IN ('processing', 'completed')
      LEFT JOIN (
        SELECT
          customer_id,
          SUM(amount) AS total_spent
        FROM
          orders
        WHERE orders.status IN ('processing', 'completed')
        GROUP BY
          customer_id
      ) t ON c.id = t.customer_id
    WHERE ${sql`c.site_id = ${siteId}`}
    GROUP BY
      c.id,
      c.name,
      t.total_spent
    ORDER BY
      t.total_spent DESC NULLS LAST
      -- c.created_at DESC
    LIMIT ${limit};
  `;

  return db.execute(stmt);
};

export const getCustomer = async (customerId: string) => {
  return db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  });
};

export const getCustomerByEmail = async (siteId: string, email: string) => {
  return db.query.customers.findFirst({
    where: and(eq(customers.email, email), eq(customers.siteId, siteId)),
  });
};

export const getCustomerByPhone = async (siteId: string, phone: string) => {
  return db.query.customers.findFirst({
    where: and(eq(customers.phone, phone), eq(customers.siteId, siteId)),
  });
};

export const createCustomer = async (data: InsertCustomer) => {
  return db.insert(customers).values(data).returning().then(first);
};

export const upsertSiteCustomer = async (
  siteId: string,
  customerData: InsertCustomer
) => {
  const data = {
    ...customerData,
    email: customerData.email || null,
    phone: customerData.phone || null,
  };

  let existing;
  if (data.email) {
    existing = await getCustomerByEmail(siteId, data.email);
  }

  if (!existing && data.phone) {
    existing = await getCustomerByPhone(siteId, data.phone);
  }

  if (existing) {
    return db
      .update(customers)
      .set(data)
      .where(eq(customers.id, existing.id))
      .returning()
      .then(first);
  } else {
    return db
      .insert(customers)
      .values({ ...data, siteId })
      .returning()
      .then(first);
  }
};
