import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  role: z.string().min(1, { message: "Role is required" }).default("user"),
});

export const editUserSchema = createUserSchema
  .omit({ email: true })
  .extend({
    userId: z.string().min(1, { message: "User ID is required" }),
    changePassword: z.coerce.boolean(),
    password: z.string().default(""),
    confirmPassword: z.string().default(""),
  })
  .superRefine(
    ({ changePassword, password, confirmPassword }, refinementContext) => {
      if (changePassword) {
        if (confirmPassword !== password) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Confirm password not matched",
            path: ["confirmPassword"],
            fatal: true,
          });
        }

        if ("" === password) {
          return refinementContext.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password kosong",
            path: ["password"],
            fatal: true,
          });
        }
      }
    }
  );
