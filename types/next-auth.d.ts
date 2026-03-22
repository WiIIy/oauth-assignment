import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "viewer" | "editor";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "viewer" | "editor";
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: "viewer" | "editor";
  }
}