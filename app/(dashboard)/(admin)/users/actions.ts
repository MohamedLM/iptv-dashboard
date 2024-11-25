"use server";

import { createUser, deleteUser, updateUser } from "@/libs/user";
import { z } from "zod";
import { createUserSchema, editUserSchema } from "./schema";
import { revalidatePath } from "next/cache";
import flatten from "lodash/flatten";
import values from "lodash/values";
import { isCurrentUserCan } from "@/utils/server/rbac";

export const actionCreateUser = async (formData: FormData) => {
  try {
    const can = await isCurrentUserCan("users:edit");
    if (!can) throw new Error("Unauthorized!");

    const data = createUserSchema.parse(Object.fromEntries(formData.entries()));
    const result = await createUser(data);

    revalidatePath("/users");

    return {
      success: true,
      message: `Successfully created!`,
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

export const actionEditUser = async (formData: FormData) => {
  try {
    const can = await isCurrentUserCan("users:edit");
    if (!can) throw new Error("Unauthorized!");

    const data = editUserSchema.parse(Object.fromEntries(formData.entries()));
    console.log("DATA", data);
    const result = await updateUser(data);

    revalidatePath("/users");

    return {
      success: true,
      message: `Successfully updated!`,
      // result,
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

export const actionDeleteUser = async (formData: FormData) => {
  try {
    const can = await isCurrentUserCan("users:edit");
    if (!can) throw new Error("Unauthorized!");

    const id = formData.get("id") as string;
    const pathToRevalidate = formData.get("pathToRevalidate") as string;

    const result = await deleteUser(id);
    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully deleted!`,
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
