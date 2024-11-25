// db/schema.ts
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { relations } from "drizzle-orm";
import { tags } from "./tags";
import { sites } from "./sites";
import { generateId } from "@/utils/uid";

export const orders = pgTable(
  "orders",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    siteId: varchar("site_id").references(() => sites.id, {
      onDelete: "cascade",
    }),
    customerId: varchar("customer_id").references(() => customers.id, {
      onDelete: "cascade",
    }),
    type: varchar("type"),
    siteOrderId: varchar("site_order_id"),
    status: varchar("status"),
    billingName: varchar("billing_name"),
    billingEmail: varchar("billing_email"),
    country: varchar("country"),
    productName: text("product_name"),
    notes: text("notes"),
    amount: numeric("amount", { precision: 10, scale: 2 }),
    currency: varchar("currency").default("USD"),
    orderDate: timestamp("order_date"),
    duration: integer("duration"),
    expiredAt: timestamp("expired_at"),
    confirmBy: varchar("confirm_by"),
    confirmedAt: timestamp("confirmed_at"),
    emailSentAt: timestamp("email_sent_at"),
    emailTemplateId: varchar("email_template_id"),
    autoRemind: boolean("auto_remind"),
    credentials: jsonb("credentials"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    siteIndex: index().on(table.siteId),
    siteOrderIndex: uniqueIndex().on(table.siteId, table.siteOrderId),
  })
);

export const orderRelations = relations(orders, ({ many }) => ({
  tags: many(tags),
}));

export type InsertOrder = typeof orders.$inferInsert;
export type SelectOrder = typeof orders.$inferSelect;
