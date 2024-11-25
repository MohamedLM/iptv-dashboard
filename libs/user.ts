import {
  createUserSchema,
  editUserSchema,
} from "@/app/(dashboard)/(admin)/users/schema";
import db, { withPagination } from "@/database";
import { accounts, users } from "@/database/schema";
import { hash, compare } from "bcrypt";
import { and, desc, eq, ilike, or, ne } from "drizzle-orm";
import pick from "lodash/pick";
import first from "lodash/first";
import { z } from "zod";
import { addSubscriberToTopic, identify } from "@/utils/server/novu";
import { isEmail } from "@/utils/common";

export const createUser = async (data: z.infer<typeof createUserSchema>) => {
  const pwHash = await hash(data.password, 10);
  return db.transaction(async (tx) => {
    const insertUser = await tx
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        image: `https://api.dicebear.com/9.x/lorelei/jpg?seed=${data.email}`,
        role: data.role,
      })
      .returning();

    const user = first(insertUser);

    if (!user?.id) throw new Error("Failed to create user");

    // identify novu subscriber
    const nameParts = String(data.name).split(" ");
    const isValidEmail = isEmail(data?.email);
    await identify(user.id, {
      firstName: nameParts[0],
      lastName: nameParts[nameParts.length - 1],
      email: isValidEmail ? data?.email : undefined,
      data: {
        role: data?.role,
      },
    });

    if ("admin" === data?.role) {
      await addSubscriberToTopic(`admin`, [user.id]);
    }

    await tx.insert(accounts).values({
      userId: user.id,
      type: "email",
      provider: "credential",
      providerAccountId: data.email,
      access_token: pwHash,
    });

    return user;
  });
};

export const updateUser = async (data: z.infer<typeof editUserSchema>) => {
  console.log("D", data);
  return db.transaction(async (tx) => {
    const updateUser = await tx
      .update(users)
      .set(pick(data, ["name", "email", "image", "role"]))
      .where(eq(users.id, data.userId))
      .returning();

    const user = first(updateUser);

    if (!user?.id) throw new Error("Failed to create user");

    // identify novu subscriber
    const nameParts = String(data.name).split(" ");
    const isValidEmail = isEmail(user?.email);
    await identify(user.id, {
      firstName: nameParts[0],
      lastName: nameParts[nameParts.length - 1],
      email: isValidEmail ? user?.email : undefined,
      data: {
        role: user?.role,
      },
    });

    if ("admin" === data?.role) {
      await addSubscriberToTopic(`admin`, [user.id]);
    }

    if (data.changePassword) {
      const pwHash = await hash(data.password, 10);
      await tx.update(accounts).set({
        access_token: pwHash,
      });
    }

    return user;
  });
};

export const getValidatedUser = async (email: string, password: string) => {
  const account = await db.query.accounts.findFirst({
    columns: {
      access_token: true,
      userId: true,
    },
    where: and(
      eq(accounts.type, "email"),
      eq(accounts.providerAccountId, email)
    ),
  });

  if (!account?.access_token || !account?.userId) {
    throw new Error("Account not found!");
  }

  const match = await compare(password, account.access_token);
  if (!match) {
    throw new Error("Invalid password!");
  }

  return db.query.users.findFirst({
    where: eq(users.id, account.userId),
  });
};

export const getAllUserOptions = async () => {
  return db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      image: true,
    },
    where: ne(users.role, "admin"),
  });
};

export const getUsers = async (
  filter?: {
    search?: string;
    role?: string;
  },
  page?: number,
  pageSize?: number
) => {
  const query = db
    .select()
    .from(users)
    .where(
      and(
        filter?.search
          ? or(
              ilike(users.name, `%${filter.search}%`),
              ilike(users.email, `%${filter.search}%`),
              ilike(users.role, `%${filter.search}%`)
            )
          : undefined,
        filter?.role ? eq(users.role, filter.role) : undefined
      )
    );

  return withPagination(db, query, desc(users.createdAt), page, pageSize);
};

export const deleteUser = async (userId: string) => {
  const result = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({ deleted: users.id })
    .then(first);

  return result;
};
