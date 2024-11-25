import db, { withPagination } from "@/database";
import { customers, orders, siteRoles, sites, users } from "@/database/schema";
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import map from "lodash/map";
import first from "lodash/first";
import { SiteData } from "@/contexts/site";
import kebabCase from "lodash/kebabCase";
import { cache } from "react";
import { setSiteSetting } from "./setting";
import { addSubscriberToTopic } from "@/utils/server/novu";

export const updateSite = async (
  siteId: string,
  data: {
    name?: string;
    secretKey?: string;
  }
) => {
  const results = await Promise.all([
    data?.name
      ? db
          .update(sites)
          .set({
            name: data.name,
          })
          .where(eq(sites.id, siteId))
      : undefined,
    data?.secretKey
      ? setSiteSetting(siteId, "secretKey", data.secretKey)
      : undefined,
  ]);

  return results;
};

export const getUserSites = async (
  userId: string
): Promise<Array<SiteData>> => {
  return db
    .select({
      id: sites.id,
      name: sites.name,
      role: siteRoles.role,
    })
    .from(siteRoles)
    .leftJoin(sites, eq(siteRoles.siteId, sites.id))
    .where(eq(siteRoles.userId, userId));
};

export const getAllSites = async (role?: string): Promise<Array<SiteData>> => {
  return db.query.sites
    .findMany({
      columns: {
        id: true,
        name: true,
      },
    })
    .then((res) =>
      map(res, (r) => ({
        ...r,
        role: role,
      }))
    );
};

export const addUserToSite = async (
  siteId: string,
  userId: string,
  role: string
) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .insert(siteRoles)
      .values({
        siteId,
        userId,
        role,
      })
      .returning()
      .then(first);

    // add user to site topic
    await addSubscriberToTopic(siteId, [userId]);

    return result;
  });
};

export const deleteUserFromSite = async (siteId: string, userId: string) => {
  return db
    .delete(siteRoles)
    .where(and(eq(siteRoles.userId, userId), eq(siteRoles.siteId, siteId)))
    .returning()
    .then(first);
};

export const getSiteUsers = async (
  siteId: string,
  filter?: {
    search?: string;
    role?: string;
  },
  page?: number,
  pageSize?: number
) => {
  const query = db
    .select({
      ...getTableColumns(users),
      createdAt: siteRoles.createdAt,
      role: siteRoles.role,
    })
    .from(siteRoles)
    .leftJoin(users, eq(users.id, siteRoles.userId))
    .where(
      and(
        eq(siteRoles.siteId, siteId),
        filter?.search
          ? or(
              ilike(users.name, `%${filter.search}%`),
              ilike(users.email, `%${filter.search}%`)
            )
          : undefined,
        filter?.role ? eq(siteRoles.role, filter.role) : undefined
      )
    );

  return withPagination(db, query, desc(users.createdAt), page, pageSize);
};

export const getuserRoleForSite = async (userId: string, siteId: string) => {
  return db.query.siteRoles.findFirst({
    where: and(eq(siteRoles.siteId, siteId), eq(siteRoles.userId, userId)),
  });
};

export const getSite = cache(async (siteId: string) => {
  console.log("get site");
  return db.query.sites.findFirst({
    where: eq(sites.id, siteId),
  });
});

export const getSitesLeaderboard = async (limit: number) => {
  const stmt = sql`
    SELECT
        o.site_id as id,
        sites.name,
        COUNT(DISTINCT paid_order.id) AS paid,
        COUNT(DISTINCT trial_order.id) AS trial,
        COALESCE(SUM(paid_order.amount), 0) AS revenue,
        totalCustomer.total AS customer
    FROM
        orders AS o
        LEFT JOIN sites ON sites.id = o.site_id
        LEFT JOIN orders paid_order ON (paid_order.id = o.id AND paid_order.type = 'paid' AND paid_order.status IN ('processing', 'completed'))
        LEFT JOIN orders trial_order ON (trial_order.id = o.id AND trial_order.type = 'trial')
        LEFT JOIN (
            SELECT
                site_id,
                COUNT(id) AS total
            FROM
                customers
            GROUP BY
                site_id
        ) AS totalCustomer ON totalCustomer.site_id = o.site_id
    GROUP BY
        o.site_id,
        sites.name,
        totalCustomer.total
    ORDER BY
        revenue DESC
    LIMIT ${limit};
  `;

  return db.execute(stmt);
};

export const getSites = async (
  filter?: {
    search?: string;
  },
  page?: number,
  pageSize?: number
) => {
  const query = db
    .select({
      ...getTableColumns(sites),
    })
    .from(sites)
    .where(
      and(
        filter?.search
          ? or(
              ilike(sites.id, `%${filter.search}%`),
              ilike(sites.name, `%${filter.search}%`)
            )
          : undefined
      )
    )
    .groupBy(sites.id)
    .orderBy(desc(sites.createdAt));

  return withPagination(db, query, desc(sites.createdAt), page, pageSize);
};

export const createSite = async (siteName: string) => {
  const id = kebabCase(siteName);
  return db
    .insert(sites)
    .values({
      id: id,
      name: siteName,
    })
    .returning()
    .then(first);
};

export const deleteSite = async (id: string) => {
  return db.delete(sites).where(eq(sites.id, id)).returning().then(first);
};
