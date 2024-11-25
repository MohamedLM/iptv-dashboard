"use server";

import flatten from "lodash/flatten";
import values from "lodash/values";
import { isCurrentUserCan } from "@/utils/server/rbac";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createTemplate,
  deleteTemplate,
  updateTemplate,
} from "@/libs/email-templates";

const createTemplateSchema = z.object({
  name: z.string(),
  subject: z.string(),
  content: z.string().optional(),
  pathToRevalidate: z.string().optional(),
});

const editTemplateSchema = createTemplateSchema.extend({
  id: z.string(),
});

export const actionCreateTemplate = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("email-templates:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const { pathToRevalidate, ...data} = createTemplateSchema.parse(
      Object.fromEntries(formData.entries())
    );
    const created = await createTemplate(data);

    console.log("DATA", { data, created });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully created!`,
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

export const actionUpdateTemplate = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("email-templates:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const {pathToRevalidate, ...data} = editTemplateSchema.parse(
      Object.fromEntries(formData.entries())
    );
    const updated = await updateTemplate(data.id, data);

    console.log("DATA", { data, updated });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully created!`,
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

export const actionDeleteTemplate = async (formData: FormData) => {
  try {
    const can = isCurrentUserCan("email-templates:edit");
    if (!can) {
      throw new Error("Unauthorized!");
    }

    const id = formData.get("id") as string;
    const pathToRevalidate = formData.get("pathToRevalidate") as string;

    const deleted = await deleteTemplate(id);
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
