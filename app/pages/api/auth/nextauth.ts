import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {PrismaClient} from "../../../../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const allowedEmails = [
  "sherinkhaira@gmail.com",
  "sherinkhairalol@gmail.com",
];

export default NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const role = allowedEmails.includes(user.email)
        ? "editor"
        : "viewer";

      // upsert user role into DB
      await prisma.user.upsert({
        where: { email: user.email },
        update: { role },
        create: {
          email: user.email,
          name: user.name,
          image: user.image,
          role,
        },
      });

      return true;
    },

    async session({ session, user }) {
      if (session.user) {
        // attach role to session
        session.user.role = user.role;
      }
      return session;
    },
  },
});