import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {PrismaClient} from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [ //authentication provider yang digunakan adalah google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    async createUser({ user }) {
      if (user.email) {
        const allowedUser = await prisma.allowedEmail.findUnique({
          where: { email: user.email }, // cek apakah email ini ada di tabel AllowedEmail
        });

        if (allowedUser && allowedUser.role === "editor") {
          await prisma.user.update({ //jika ada di database dan role-nya editor, update user yang baru dibuat
            where: { id: user.id },
            data: { role: "editor" },
          });
        }
      }
    },
  },
   //beri role ke front end melalui session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.role = user.role as "viewer" | "editor";
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

// pass config to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };