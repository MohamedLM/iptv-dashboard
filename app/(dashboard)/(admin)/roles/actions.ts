"use server";

import { getSetting, setSetting } from "@/libs/setting";
import map from "lodash/map";
import filter from "lodash/filter";
import kebabCase from "lodash/kebabCase";
import transform from "lodash/transform";
import { revalidatePath } from "next/cache";

interface ResultMap {
  [role: string]: string[];
}

export const actionCreateRole = async (
  formData: FormData
): Promise<{
  result?: any;
  error?: {
    message?: string;
    fieldErrors?: object;
    formErrors?: any[];
  };
}> => {
  try {
    const { name } = Object.fromEntries(formData.entries());
    if (!name) {
      throw new Error("Invalid role name");
    }

    const roleSlug = kebabCase(`${name}`);
    const customRoles = await getSetting("customRoles", "[]").then((res) =>
      JSON.parse(res as string)
    );

    if (map(customRoles, "role").includes(roleSlug)) {
      throw new Error(`Role ${roleSlug} already exists!`);
    }

    const roles = [
      ...customRoles,
      {
        role: roleSlug,
        label: name,
        can: [],
      },
    ];

    await setSetting("customRoles", JSON.stringify(roles));
    revalidatePath("/roles");

    return {
      result: {
        role: roleSlug,
        label: name,
        can: [],
      },
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      error: {
        message: errorMessage,
      },
    };
  }
};

export const actionDeleteRole = async (
  formData: FormData
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    const { roleId } = Object.fromEntries(formData.entries());

    const customRoles = await getSetting("customRoles", "[]").then((res) =>
      JSON.parse(res as string)
    );

    const newRoles = filter(customRoles, (role) => {
      return role.role !== roleId;
    });

    console.log("customRoles", { roleId, customRoles, newRoles });
    await setSetting("customRoles", JSON.stringify(newRoles));
    revalidatePath("/roles");

    return {
      success: true,
      message: `Successfully deleted!`,
    };
  } catch (error) {
    const errorMessage = (error as Error).message || "Something went wrong";
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const actionSaveRolePermissions = async (formData: FormData) => {
  // transform form data to the role object.
  const data: any = Object.fromEntries(formData.entries());
  const permissions: ResultMap = transform(
    data,
    (acc: ResultMap, value: string, key: string) => {
      const match = key.match(/^(\S+)\[(\w+)\]\[(\w+)\]$/);
      if (match) {
        const [, role, resource, action] = match;
        if (!acc[role]) {
          acc[role] = [];
        }
        acc[role].push(`${resource}:${action}`);
      }
    },
    {}
  );

  const customRoles = await getSetting("customRoles", "[]").then((res) =>
    JSON.parse(res as string)
  );

  const mappedCaps = map(customRoles, (role) => {
    if (permissions[role.role]) {
      return {
        ...role,
        can: permissions[role.role],
      };
    }
    return role;
  });

  await setSetting("customRoles", JSON.stringify(mappedCaps));
  revalidatePath("/roles");
  return mappedCaps;
};
