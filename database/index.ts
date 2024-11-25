import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/database/schema";
import { PgColumn } from "drizzle-orm/pg-core";
import { SQL, sql } from "drizzle-orm";
import toInteger from "lodash/toInteger";

// for migrations
export const migrationClient = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

let db;
if ("development" === process.env.NODE_ENV) {
  let cachedDb: any;
  if (!cachedDb) {
    const queryClient = postgres(process.env.DATABASE_URL!, {
      idle_timeout: 20000,
    });
    cachedDb = drizzle(queryClient, { schema });
  }
  db = cachedDb;
} else {
  const queryClient = postgres(process.env.DATABASE_URL!, {
    idle_timeout: 20000,
  });

  db = drizzle(queryClient, { schema });
}

export const withPagination = async (
  db: PostgresJsDatabase<typeof schema>,
  query: any,
  orderByColumn: PgColumn | SQL,
  page = 1,
  pageSize = 20
) => {
  const subQuery = query.as("subQuery");
  const [results, totalRows] = await Promise.all([
    query
      .$dynamic()
      .orderBy(orderByColumn)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute(),
    db
      .select({ total: sql<number>`count(*)` })
      .from(subQuery)
      .then((res) => res[0].total),
  ]);

  return {
    rows: results,
    total: toInteger(totalRows),
  };
};

export default db as PostgresJsDatabase<typeof schema>;
