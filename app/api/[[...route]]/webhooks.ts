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
import { requestSchema } from "./order";

const app = new Hono();

export const requestTrialSchema = requestSchema
  .extend({
    message: z.string().optional(),
  })
  .refine(
    ({ phone, email }) => {
      return !!email || !!phone;
    },
    {
      message: "Either phone or email should be provided!",
    }
  );

app.post("/:siteId/elementor", async (c) => {
  try {
    const siteId = c.req.param("siteId");
    const body = await c.req.parseBody();
    const mappedFields = Object.entries(body).reduce(
      (acc: any, [key, value]) => {
        // Check if the key contains 'fields' and has an 'id' suffix
        if (key.includes("fields") && key.endsWith("[id]")) {
          const fieldKey = key.replace("[id]", "[value]");
          acc[value as string] = body[fieldKey]; // Map id to value
        }
        return acc;
      },
      {}
    );
    const data = requestTrialSchema.parse(mappedFields);

    console.log("data", data);

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

    const result = await createTrialOrderForCustomer(
      siteId,
      customer.id,
      true,
      dbData
    );

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
