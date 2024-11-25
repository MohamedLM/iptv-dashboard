"use server";
import { signIn } from "@/auth";

export const actionSignin = async (formData: FormData) => {
  try {
    console.log("Data", Object.fromEntries(formData.entries()));
    const result = await signIn("credentials", formData).catch((err) => {
      if ("NEXT_REDIRECT" !== err?.message) {
        throw err;
      }
      return true;
    });
    return {
      success: true,
      message: "Successfully logged in",
      result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to login",
    };
  }
};
