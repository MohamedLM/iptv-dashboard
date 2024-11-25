import { workflow } from "@novu/framework";
import { renderEmail } from "@/emails/sample";
import { z } from "zod";

export const testWorkflow = workflow(
  "test-workflow",
  async ({ step, payload }) => {
    await step.email(
      "send-email",
      async (controls) => {
        return {
          subject: controls.subject,
          body: renderEmail(payload.userName),
        };
      },
      {
        controlSchema: z.object({
          subject: z
            .string()
            .default("A Successful Test on Novu from {{userName}}"),
        }),
      }
    );
  },
  {
    payloadSchema: z.object({
      userName: z.string().default("John Doe"),
    }),
  }
);

export const trialRequest = workflow(
  "trial-request",
  async ({ step, payload }) => {
    await step.inApp("send-inbox", async () => {
      return {
        subject: "New trial request!",
        body: `There is new trial request from ${payload.customerName},\ntrial id: ${payload.orderId}`,
        // avatar: "https://api.dicebear.com/9.x/lorelei/jpg?seed=admin",
        // primaryAction: {
        //   label: "View Request",
        //   url: `/manage/${payload.siteId}/trials?s=${payload.orderId}`,
        // },
        // secondaryAction: {
        //   label: "Learn More",
        //   url: "https://acme.com/learn-more",
        // },
      };
    });
  },
  {
    payloadSchema: z.object({
      siteId: z.string(),
      orderId: z.string(),
      customerName: z.string(),
    }),
    tags: ["orders", "trial-orders"],
  }
);

export const paidRequest = workflow(
  "paid-request",
  async ({ step, payload }) => {
    await step.inApp("send-inbox", async () => {
      return {
        subject: "New subscription!",
        body: `There is new subscription: ${payload.productName} (${payload.amount}) \n from ${payload.customerName},\norder id: ${payload.orderId}`,
        // avatar: "https://api.dicebear.com/9.x/lorelei/jpg?seed=admin",
        // primaryAction: {
        //   label: "View Request",
        //   url: `/manage/${payload.siteId}/trials?s=${payload.orderId}`,
        // },
        // secondaryAction: {
        //   label: "Learn More",
        //   url: "https://acme.com/learn-more",
        // },
      };
    });
  },
  {
    payloadSchema: z.object({
      siteId: z.string(),
      orderId: z.string(),
      customerName: z.string(),
      productName: z.string().optional(),
      amount: z.coerce.number().optional(),
    }),
    tags: ["orders", "paid-orders"],
  }
);
