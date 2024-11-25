import db, { withPagination } from "@/database";
import { emailTemplates, InsertEmailTemplate } from "@/database/schema";
import { replacePlaceholder } from "@/utils/common";
import { and, desc, eq, getTableColumns, ilike, or } from "drizzle-orm";
import map from "lodash/map";
import first from "lodash/first";

export const getEmailTemplates = async (
  filter?: {
    search?: string;
  },
  page?: number,
  pageSize?: number
) => {
  const query = db
    .select({
      ...getTableColumns(emailTemplates),
    })
    .from(emailTemplates)
    .where(
      and(
        filter?.search
          ? or(ilike(emailTemplates.name, `%${filter.search}%`))
          : undefined
      )
    )
    .groupBy(emailTemplates.id)
    .orderBy(desc(emailTemplates.createdAt));

  return withPagination(
    db,
    query,
    desc(emailTemplates.createdAt),
    page,
    pageSize
  );
};

export const createTemplate = async (data: InsertEmailTemplate) => {
  return db.insert(emailTemplates).values(data).returning().then(first);
};

export const updateTemplate = async (id: string, data: InsertEmailTemplate) => {
  return db
    .update(emailTemplates)
    .set(data)
    .where(eq(emailTemplates.id, id))
    .returning()
    .then(first);
};

export const deleteTemplate = async (id: string) => {
  return db
    .delete(emailTemplates)
    .where(eq(emailTemplates.id, id))
    .returning()
    .then(first);
};

export const getEmailTemplateOptions = async () => {
  return db.query.emailTemplates.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
};

export const getEmailTemplate = async (id: string) => {
  return db.query.emailTemplates.findFirst({
    where: eq(emailTemplates.id, id),
  });
};

export const replaceTemplateContent = async (
  content: string,
  data: Record<string, any>
) => {
  let { credentials, ...rest } = data;
  if (credentials) {
    credentials = data.credentials.reduce(
      (
        acc: Record<string, string>,
        item: { username: string; password: string },
        index: number
      ) => {
        acc[`username${index + 1}`] = item.username;
        acc[`password${index + 1}`] = item.password;
        return acc;
      },
      {}
    );
  }

  const replaced = replacePlaceholder(content || "", {
    ...rest,
    ...credentials,
  });

  // console.log("replaced", replaced);

  return replaced;
};
