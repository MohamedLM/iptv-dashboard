"use server";

import flatten from "lodash/flatten";
import values from "lodash/values";
import { isCurrentSiteUserCan } from "@/utils/server/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import toInteger from "lodash/toInteger";
import transform from "lodash/transform";
import { setCredentialsForOrder } from "@/libs/order";

const credentialSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const processPanelSchema = z.object({
  id: z.string(),
  siteId: z.string(),
  credentials: z.array(credentialSchema),
  duration: z.coerce.number(),
  durationType: z.string(),
  sendEmail: z.coerce.boolean(),
  autoRemind: z.coerce.boolean(),
  pathToRevalidate: z.string().optional(),
  emailTemplate: z.string().optional(),
});

export const actionProcessPanelRequest = async (formData: FormData) => {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const transformedData = transform(
      rawData,
      (
        result: { credentials?: any[]; [key: string]: any } = {},
        value,
        key
      ) => {
        if (key.startsWith("credentials.")) {
          const [, indexStr, prop] = key.split(".");
          if (!result.credentials) {
            result.credentials = [];
          }
          const index = toInteger(indexStr);
          if (!result.credentials[index]) {
            result.credentials[index] = {};
          }
          result.credentials[index][prop] = value;
        } else {
          result[key] = value;
        }
      },
      {}
    );

    const { durationType, ...data } = processPanelSchema.parse(transformedData);
    const duration = "month" === durationType ? data.duration * 30 : data.duration;

    if (data.sendEmail && !data.emailTemplate) {
      throw new Error("Please select email template");
    }

    const session = await auth();
    const userId = session?.user?.id;
    const can = await isCurrentSiteUserCan(data.siteId, "trials:edit");
    if (!can) throw new Error("Unauthorized");

    console.log("DATA", data);

    const result = await setCredentialsForOrder(
      data.id,
      data.credentials,
      duration,
      data.sendEmail,
      data.autoRemind,
      userId!,
      data.emailTemplate
    );

    console.log("DATA", JSON.stringify({ data, result }, null, 2));

    if (data.pathToRevalidate) {
      revalidatePath(data.pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully processed!`,
      result,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { formErrors, fieldErrors } = error.flatten();
      return {
        success: false,
        message:
          flatten(values(fieldErrors)).join(", ") || "Invalid form request",
        formErrors,
        fieldErrors,
      };
    }

    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};
