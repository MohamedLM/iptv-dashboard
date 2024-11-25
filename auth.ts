import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/database";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/database/schema";
import { getValidatedUser } from "./libs/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: "development" === process.env.NODE_ENV,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  basePath: `/auth`,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // @ts-ignore
      authorize: async (credentials: {
        username: string;
        password: string;
      }) => {
        console.log("credentials", credentials);
        if (!credentials.username) {
          throw new Error("Invalid username");
        }

        if (!credentials.password) {
          throw new Error("Invalid password");
        }
        const user = await getValidatedUser(
          credentials.username,
          credentials.password
        );

        if (!user) {
          throw new Error("Invalid username or password!");
        }

        return user;
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials, ...rest }) {
      // user.id
      // console.log("signin", {
      //   user,
      //   account,
      //   profile,
      //   email,
      //   credentials,
      //   rest,
      // });
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    jwt({ token, user, account, profile, trigger, ...data }): JWT {
      // console.log('JWT', { token, user })
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token, ...rest }: { session: Session; token: JWT }) {
      session.user.id = token.sub; // include the user id to the session.
      session.user.role = token.role;
      // console.log('SESSION', { session, token, rest })
      return session;
    },
  },
});
