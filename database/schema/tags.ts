// db/schema.ts
import { relations } from "drizzle-orm";
import {
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { customers } from "./customers";

export const tags = pgTable("tags", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name").notNull(),
  type: varchar("type"),
  color: varchar("color"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const objectTags = pgTable(
  "object_tags",
  {
    tagId: varchar("tag_id").references(() => tags.id, {
      onDelete: "cascade",
    }),
    objectId: varchar("object_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    uniqueTag: uniqueIndex().on(table.tagId, table.objectId),
  })
);

export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
