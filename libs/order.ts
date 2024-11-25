import { requestOrderSchema } from "@/app/api/[[...route]]/order";
import db, { withPagination } from "@/database";
import {
  customers,
  emailTemplates,
  InsertOrder,
  objectTags,
  orders,
  SelectOrder,
  tags,
  users,
} from "@/database/schema";
import { sendCredentialEmail } from "@/utils/server/email";
import { triggerTopicNotification } from "@/utils/server/novu";
import { addDays } from "date-fns";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import first from "lodash/first";
import { z } from "zod";
import { getSiteSetting, getSiteSmtpSetting } from "./setting";
import { getCustomer } from "./customer";
import { requestTrialSchema } from "@/app/api/[[...route]]/webhooks";
import toLower from "lodash/toLower";

export const COMPLETED_STATUSES = ["processing", "completed"];

interface GetOrders {
  rows: Array<SelectOrder & { tags: string }>;
  total: number;
}

export interface PanelCredential {
  username: string;
  password: string;
}

export const getOrder = async (orderId: string) => {
  return db
    .select({
      ...getTableColumns(orders),
      customer: customers,
    })
    .from(orders)
    .leftJoin(customers, eq(customers.id, orders.customerId))
    .where(eq(orders.id, orderId))
    .limit(1)
    .then(first);
};

export const getOrders = async (
  siteId?: string,
  filter?: {
    search?: string;
    type?: string;
    completed?: boolean;
    requestDateRange?: {
      from: string;
      to: string;
    };
    credentialStatus?: string;
    sort?: {
      column: string;
      direction: string;
    };
  },
  page?: number,
  pageSize?: number
): Promise<GetOrders> => {
  let filterCredentialStatus = undefined;
  const currentDate = new Date();
  const expiredSoonDate = addDays(currentDate, 10);
  switch (filter?.credentialStatus) {
    case "processed":
      filterCredentialStatus = isNotNull(orders.confirmedAt);
      break;

    case "unprocessed":
      filterCredentialStatus = isNull(orders.confirmedAt);
      break;

    case "expired":
      filterCredentialStatus = lt(orders.expiredAt, currentDate);
      break;

    case "expiredSoon":
      filterCredentialStatus = and(
        gte(orders.expiredAt, currentDate),
        lt(orders.expiredAt, expiredSoonDate)
      );
      break;
  }

  const query = db
    .select({
      ...getTableColumns(orders),
      customer: customers,
      confirmer: users,
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
      emailTemplate: emailTemplates.name,
    })
    .from(orders)
    .leftJoin(users, eq(users.id, orders.confirmBy))
    .leftJoin(customers, eq(customers.id, orders.customerId))
    .leftJoin(objectTags, eq(objectTags.objectId, customers.id))
    .leftJoin(tags, eq(tags.id, objectTags.tagId))
    .leftJoin(emailTemplates, eq(emailTemplates.id, orders.emailTemplateId))
    .where(
      and(
        siteId ? eq(orders.siteId, siteId) : undefined,
        filter?.type ? eq(orders.type, filter.type) : undefined,
        undefined !== filter?.completed
          ? filter.completed
            ? inArray(orders.status, COMPLETED_STATUSES)
            : notInArray(orders.status, COMPLETED_STATUSES)
          : undefined,
        filter?.search
          ? or(
              ilike(customers.name, `%${filter.search}%`),
              ilike(customers.email, `%${filter.search}%`),
              ilike(tags.name, `%${filter.search}%`),
              ilike(orders.siteOrderId, `%${filter.search}%`),
              ilike(orders.id, `%${filter.search}%`)
            )
          : undefined,
        filterCredentialStatus,
        filter?.requestDateRange
          ? and(
              gte(orders.createdAt, new Date(filter.requestDateRange.from)),
              lte(orders.createdAt, new Date(filter.requestDateRange.to))
            )
          : undefined
      )
    )
    .groupBy(orders.id, customers.id, users.id, emailTemplates.id);

  // return query.toSQL();

  return withPagination(
    db,
    query,
    filter?.sort
      ? "descending" === filter.sort.direction
        ? desc(sql.identifier(filter.sort.column))
        : asc(sql.identifier(filter.sort.column))
      : desc(orders.createdAt),
    page,
    pageSize
  );
};

export const createTrialOrderForCustomer = async (
  siteId: string,
  customerId: string,
  validateActiveTrial: boolean,
  data: z.infer<typeof requestTrialSchema> & { metadata?: any }
) => {
  const formattedData = {
    siteId,
    customerId,
    type: "trial",
    billingName: data?.name,
    billingEmail: data?.email,
    country: data?.country,
    notes: data?.message,
    metadata: data?.metadata,
  };

  if (validateActiveTrial) {
    const activeTrialOrder = await db.query.orders.findFirst({
      where: and(
        eq(orders.customerId, customerId),
        or(isNull(orders.expiredAt), gte(orders.expiredAt, new Date()))
      ),
    });

    if (activeTrialOrder) {
      throw new Error("There is an active trial for customer");
    }
  }

  const result = await db
    .insert(orders)
    .values(formattedData)
    .returning()
    .then(first);

  // send notification to admin
  const customer = await getCustomer(customerId);
  await triggerTopicNotification("trial-request", ["admin", siteId], {
    siteId,
    orderId: result?.id,
    customerName: customer?.name || "Customer",
  });

  return result;
};

export const createPaidOrderForCustomer = async (
  siteId: string,
  customerId: string,
  data: z.infer<typeof requestOrderSchema> & { metadata?: any }
) => {
  const existingOrder = await db.query.orders.findFirst({
    where: and(eq(orders.siteId, siteId), eq(orders.siteOrderId, data.orderId)),
  });

  const formattedData = {
    siteId,
    customerId,
    type: "paid",
    billingName: data?.name,
    billingEmail: data?.email,
    country: data?.country,
    productName: data?.productName,
    amount: data?.amount,
    currency: data?.currency,
    orderDate: data?.orderDate,
    duration: data?.duration,
    siteOrderId: data?.orderId,
    status: toLower(data?.status),
    notes: data?.notes,
    metadata: data?.metadata,
  };

  let result;
  if (existingOrder) {
    result = await db
      .update(orders)
      .set(formattedData)
      .where(eq(orders.id, existingOrder.id))
      .returning()
      .then(first);
  } else {
    result = await db
      .insert(orders)
      .values(formattedData)
      .returning()
      .then(first);
  }

  if (COMPLETED_STATUSES.includes(data?.status)) {
    const customer = await getCustomer(customerId);

    // clean up abandoned order.
    if (customer?.id) {
      await cleanUpCustomerAbandonedOrders(customer.id);
    }

    console.log("customer", { customer });

    // send notification to admin
    await triggerTopicNotification("paid-request", ["admin", siteId], {
      siteId,
      orderId: result?.id,
      customerName: customer?.name || "Customer",
      productName: data?.productName,
      amount: data?.amount,
    });
  }

  return result;
};

export const setCredentialsForOrder = async (
  orderId: string,
  credentials: PanelCredential[],
  duration: number,
  sendEmail: boolean,
  autoRemind: boolean,
  confirmBy: string,
  emailTemplate?: string
) => {
  let emailSent = false;
  if (sendEmail && emailTemplate) {
    // send email
    const order = await getOrder(orderId);
    if (!order?.customer || !order.customer?.email)
      throw new Error("Invalid customer");

    const emailFrom = await getSiteSetting(order.siteId!, "emailFrom");
    if (!emailFrom) {
      throw new Error("Email from have not set!");
    }

    // try to get custom smtpTransport
    const smtpTransport = await getSiteSmtpSetting(order.siteId!);

    console.log("Send email", emailTemplate);
    emailSent = await sendCredentialEmail(
      emailTemplate,
      { name: order.customer?.name || "", credentials },
      {
        from: emailFrom as string,
        to: order.customer?.email,
        smtpTransport,
      }
    );
  }

  const currentDate = new Date();
  const updated = await db
    .update(orders)
    .set({
      credentials,
      autoRemind,
      emailSentAt: emailSent ? currentDate : undefined,
      emailTemplateId: emailSent ? emailTemplate : undefined,
      confirmBy,
      confirmedAt: currentDate,
      expiredAt: addDays(currentDate, duration),
    })
    .where(eq(orders.id, orderId))
    .returning()
    .then(first);

  if (autoRemind) {
    // TODO: Novu schedule
    console.log("Schedule auto reminder");
  }

  return updated;
};

const cleanUpCustomerAbandonedOrders = async (customerId: string) => {
  return db
    .delete(orders)
    .where(
      and(
        eq(orders.customerId, customerId),
        eq(orders.type, "paid"),
        notInArray(orders.status, COMPLETED_STATUSES)
      )
    );
};
