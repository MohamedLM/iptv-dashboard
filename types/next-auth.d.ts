import NextAuth, { DefaultSession } from "next-auth";

// https://next-auth.js.org/getting-started/typescript
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    name?: string | null;
    image?: string | null;
    email?: string | null;
    role?: string | null;
  }
}

/** Example on how to extend the built-in types for JWT */
export declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}
