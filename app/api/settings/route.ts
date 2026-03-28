// route untuk mengganti setting font dan warna background dari client ke server

import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions); // Ambil session user yang sedang melakukan request

    // cek apakah user sudah login DAN rolenya editor
    if (!session || session.user?.email === undefined || session.user.email === null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // cek role user di database untuk keamanan
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (dbUser?.role !== "editor") {
        return NextResponse.json({ error: "Forbidden: Editors only" }, { status: 403 });
    }

    // simpan setting jika user adalah editor
    const body = await req.json();
    const { background, textColor, fontFamily } = body;

    const updatedSettings = await prisma.siteSetting.upsert({
      where: { id: "global" },
      update: { background, textColor, fontFamily },
      create: { id: "global", background, textColor, fontFamily },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}