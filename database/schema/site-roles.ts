import {
  index,
  pgTable,
  primaryKey,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { sites } from "./sites";

export const siteRoles = pgTable(
  "site_roles",
  {
    siteId: varchar("site_id").references(() => sites.id, {
      onDelete: "cascade",
    }),
    userId: varchar("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    role: varchar("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userSiteRole: unique().on(table.siteId, table.userId),
  })
);
