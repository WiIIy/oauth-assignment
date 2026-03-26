import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {PrismaClient} from "../../../generated/prisma/client";

const prisma = new PrismaClient();

//buat authentication handler
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  //provider yang digunakan adalah google
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  //event setelah user telah di create
  events: {
    async createUser({ user }) {
      if (user.email && allowedEmails.includes(user.email)) {
        await prisma.user.update({ //prisma sudah menghandle fungsionalitas ini
          where: { id: user.id },
          data: { role: "editor" },
        });
      }
    },
  },

  //beri role ke front end
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.role = user.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };