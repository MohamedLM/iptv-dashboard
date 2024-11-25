"use server";

import { InsertTag } from "@/database/schema";
import { addNewTag, addTag, deleteTag, updateTag } from "@/libs/tag";
import { revalidatePath } from "next/cache";

export const actionAddTag = async (id: string, tagId: string) => {
  try {
    const result = await addTag(id, tagId);
    return {
      success: true,
      message: `Successfully added ${tagId} to ${id}!`,
      result,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const actionAddNewTag = async (
  id: string,
  name: string,
  type: string = "customer"
) => {
  try {
    const result = await addNewTag(id, name, type);
    return {
      success: true,
      message: `Successfully added ${name} to ${id}!`,
      result,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const actionUpdateTag = async (
  id: string,
  data: InsertTag,
  pathToRevalidate?: string
) => {
  try {
    const result = await updateTag(id, data);
    console.log('pathToRevalidate', pathToRevalidate)
    if (pathToRevalidate) {
      revalidatePath(pathToRevalidate);
    }
    return {
      success: true,
      message: `Successfully updated tag ${id}!`,
      result,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const actionDeleteTag = async (id: string, tagId: string) => {
  try {
    const result = await deleteTag(id, tagId);
    return {
      success: true,
      message: `Successfully deleted ${tagId} from ${id}!`,
      result,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};
