"use server";

import { auth } from "@/auth";
import { addUserToSite, deleteUserFromSite } from "@/libs/site";
import { revalidatePath } from "next/cache";

export const actionAddUserToSite = async (formData: FormData) => {
  const session = await auth();

  try {
    if (!session?.user.id) {
      throw new Error("Unauthorized!");
    }

    const userId = formData.get("userId") as string;
    const siteId = formData.get("siteId") as string;
    const role = formData.get("role") as string;
    const pathToRevalidate = formData.get("pathToRevalidate") as string;

    const added = await addUserToSite(siteId, userId, role);
    console.log("addUserToSite", { userId, siteId, role, pathToRevalidate });

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully added!`,
      result: added,
    };
  } catch (error) {
    const message = (error as Error).message;
    return {
      success: false,
      message,
    };
  }
};
export const actionDeleteSiteUser = async (formData: FormData) => {
  const session = await auth();

  try {
    if (!session?.user.id) {
      throw new Error("Unauthorized!");
    }

    const userId = formData.get("userId") as string;
    const siteId = formData.get("siteId") as string;
    const pathToRevalidate = formData.get("pathToRevalidate") as string;

    const deleted = await deleteUserFromSite(siteId, userId);

    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }

    return {
      success: true,
      message: `Successfully deleted!`,
      deleted,
    };
  } catch (error) {
    const message = (error as Error).message;
    return {
      success: false,
      message,
    };
  }
};
