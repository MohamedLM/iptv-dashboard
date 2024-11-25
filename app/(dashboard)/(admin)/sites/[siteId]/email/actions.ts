"use server";

import { isCurrentUserCan } from "@/utils/server/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import flatten from "lodash/flatten";
import values from "lodash/values";
import { setSiteSetting, setSiteSmtpSetting } from "@/libs/setting";

const saveEmailSettingSchema = z.object({
  siteId: z.string(),
  emailFrom: z.string(),
  smtpHost: z.string(),
  smtpPort: z.coerce.number(),
  smtpSecure: z.coerce.boolean(),
  smtpUsername: z.string(),
  smtpPassword: z.string(),
  pathToRevalidate: z.string().optional(),
});

export const actionSaveEmailSetting = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("sites:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const { pathToRevalidate, siteId, ...data } = saveEmailSettingSchema.parse(
      Object.fromEntries(formData.entries())
    );

    const smtpSetting = {
      host: data.smtpHost,
      port: data.smtpPort,
      secure: data.smtpSecure,
      auth: {
        user: data.smtpUsername,
        pass: data.smtpPassword,
      },
    };

    await Promise.all([
      setSiteSetting(siteId, "emailFrom", data.emailFrom),
      setSiteSmtpSetting(siteId, smtpSetting),
    ]);

    console.log("DATA", { siteId, pathToRevalidate, smtpSetting });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully updated!`,
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
