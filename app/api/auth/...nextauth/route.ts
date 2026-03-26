import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool); // 3. Pass the pool, not an object
const prisma = new PrismaClient({ adapter });

const allowedEmails = [
  "sherinkhaira@gmail.com",
  "sherinkhairalol@gmail.com",
];

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    //callback pas signin, assign role
    async session({ session, user }) {
      if (session.user) {
        session.user.role = user.role;
      }
      return session;
    },
  },

  //make user
  events: {
    async createUser({ user }) {
      if (user.email && allowedEmails.includes(user.email)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "editor" },
        });
      }
    },
  },
});

export { handler as GET, handler as POST };