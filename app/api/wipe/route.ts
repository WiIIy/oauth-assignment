import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

//utility buat delete data kalo masih ada

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({adapter});

export async function GET() {
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
    return NextResponse.json({ message: "Database completely wiped!" });
}