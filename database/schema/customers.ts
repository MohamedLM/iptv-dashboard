// db/schema.ts
import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { tags } from "./tags";
import { sites } from "./sites";

export const customers = pgTable(
  "customers",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    siteId: varchar("site_id").references(() => sites.id, {
      onDelete: "cascade",
    }),
    name: varchar("name"),
    email: varchar("email").unique("customer_email_unq"),
    phone: varchar("phone").unique("customer_phone_unq"),
    notes: jsonb("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    siteIndex: index().on(table.siteId),
  })
);

export const customerRelations = relations(customers, ({ many }) => ({
  tags: many(tags),
}));

export type InsertCustomer = typeof customers.$inferInsert;
export type SelectCustomer = typeof customers.$inferSelect;
