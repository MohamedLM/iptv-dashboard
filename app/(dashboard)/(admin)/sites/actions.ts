"use server";

import { createSite, deleteSite } from "@/libs/site";
import flatten from "lodash/flatten";
import values from "lodash/values";
import { isCurrentUserCan } from "@/utils/server/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createSiteSchema = z.object({
  name: z.string(),
  pathToRevalidate: z.string().optional(),
});

export const actionCreateSite = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("sites:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const data = createSiteSchema.parse(Object.fromEntries(formData.entries()));
    const created = await createSite(data.name);

    console.log("DATA", { data, created });

    if (data.pathToRevalidate) {
      revalidatePath(data.pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully created!`,
      redirect: `/sites/${created?.id}`,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { formErrors, fieldErrors } = error.flatten();
      return {
        success: false,
        message: flatten(values(fieldErrors)).join(", ") || "Invalid form request",
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

export const actionDeleteSite = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("sites:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const id = formData.get("id") as string;
    const pathToRevalidate = formData.get("pathToRevalidate") as string;

    const deleted = await deleteSite(id);
    console.log("DATA", { id, pathToRevalidate, deleted });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully deleted!`,
    };
  } catch (error) {
    const message = (error as Error).message;
    return {
      success: false,
      message,
    };
  }
};
