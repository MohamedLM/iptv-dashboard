import db from "@/database";
import { InsertTag, objectTags, tags } from "@/database/schema";
import { and, asc, eq, gt, ilike, sql } from "drizzle-orm";
import first from "lodash/first";

export const getNextTagOptions = (
  type: string,
  search?: string,
  cursor?: string,
  pageSize: number = 5
) => {
  return db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
    })
    .from(tags)
    .where(
      and(
        search ? ilike(tags.name, `%${search}%`) : undefined,
        cursor ? gt(tags.name, cursor) : undefined,
        eq(tags.type, type)
      )
    )
    .orderBy(tags.name)
    .limit(pageSize);
};

export const addTag = async (objectId: string, tagId: string) => {
  return db
    .insert(objectTags)
    .values({ tagId, objectId })
    .returning()
    .then(first);
};

export const addNewTag = async (
  objectId: string,
  name: string,
  type: string = "customer"
) => {
  return db.transaction(async (tx) => {
    const tag = await tx
      .insert(tags)
      .values({
        name,
        type,
      })
      .returning()
      .then(first);

    if (!tag?.id) throw new Error("Failed to insert tag");

    await tx.insert(objectTags).values({
      tagId: tag.id,
      objectId,
    });

    return tag;
  });
};

export const updateTag = async (tagId: string, data: InsertTag) => {
  return db
    .update(tags)
    .set(data)
    .where(eq(tags.id, tagId))
    .returning()
    .then(first);
};

export const deleteTag = async (objectId: string, tagId: string) => {
  return db
    .delete(objectTags)
    .where(and(eq(objectTags.objectId, objectId), eq(objectTags.tagId, tagId)))
    .returning()
    .then(first);
};
