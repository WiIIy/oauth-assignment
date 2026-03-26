import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: "viewer" | "editor";
      theme: "light" | "dark";
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role: "viewer" | "editor";
    theme: "light" | "dark";
  }

  interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    role: "viewer" | "editor";
    theme: "light" | "dark";
  }
}