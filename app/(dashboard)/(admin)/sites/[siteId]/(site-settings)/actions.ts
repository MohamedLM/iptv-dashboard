"use server";

import { isCurrentUserCan } from "@/utils/server/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import flatten from "lodash/flatten";
import values from "lodash/values";
import { updateSite } from "@/libs/site";

const saveSiteSettingSchema = z.object({
  siteId: z.string(),
  name: z.string(),
  secretKey: z.string(),
  pathToRevalidate: z.string().optional(),
});

export const actionSaveSiteSetting = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("sites:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const { siteId, name, secretKey, pathToRevalidate } =
      saveSiteSettingSchema.parse(Object.fromEntries(formData.entries()));

    const res = await updateSite(siteId, { name, secretKey });

    console.log("DATA", { res });

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
