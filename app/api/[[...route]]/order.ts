import { upsertSiteCustomer } from "@/libs/customer";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";
import flatten from "lodash/flatten";
import values from "lodash/values";
import { getSiteSetting } from "@/libs/setting";
import {
  createPaidOrderForCustomer,
  createTrialOrderForCustomer,
} from "@/libs/order";

const app = new Hono();

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const requestSchema = z.object({
  name: z.string().default(""),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  country: z.string().default(""),
});

export const requestOrderSchema = requestSchema
  .extend({
    productName: z.string().default(""),
    notes: z.string().optional(),
    amount: z.string(),
    currency: z.string().default("USD"),
    orderId: z.coerce.string(),
    status: z.coerce.string(),
    orderDate: z.coerce.date(),
    duration: z.coerce.number(),
  })
  .refine(
    ({ phone, email }) => {
      return !!email || !!phone;
    },
    {
      message: "Either phone or email should be provided!",
    }
  );

app.use(
  bearerAuth({
    verifyToken: async (token, c) => {
      const siteId = c.req.header("X-Site-Id");
      if (!siteId) throw new Error("Invalid site id");
      const secretKey = await getSiteSetting(siteId, "secretKey", siteId);
      return token === secretKey;
    },
  })
);

app.post("/", async (c) => {
  try {
    const siteId = c.req.header("X-Site-Id");
    if (!siteId) {
      throw new Error("Invalid site id");
    }

    const body = await c.req.json();
    const data = requestOrderSchema.parse(body);

    const customer = await upsertSiteCustomer(siteId, data);

    if (!customer?.id) {
      throw new Error("Failed to create customer");
    }

    const dbData = {
      ...data,
      metadata: {
        rawBody: body,
      },
    };
    const result = await createPaidOrderForCustomer(
      siteId,
      customer.id,
      dbData
    );
    console.log("result", result);

    return c.json({
      success: true,
      result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { formErrors, fieldErrors } = error.flatten();
      return c.json(
        {
          success: false,
          message:
            flatten(values(fieldErrors)).join(", ") || "Invalid form request",
          formErrors,
          fieldErrors,
        },
        400
      );
    }

    return c.json(
      {
        success: false,
        message: (error as Error)?.message,
      },
      400
    );
  }
});

export default app;
