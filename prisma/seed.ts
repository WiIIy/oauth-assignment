//seed dalam database adalah starting value, db di isi oleh allowed emails yang hard coded jadi user lain tidak bisa jadi editor

import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const editorEmails = process.env.ALLOWED_EDITORS?.split(",") || []; // ambil emails dari .env dan jadikan array

  if (editorEmails.length === 0) {
    console.warn("No email found in ALLOWED_EDITORS.");
    return;
  }

  await prisma.allowedEmail.deleteMany({});  // clear entries agar tidak ada duplikat

  // format data untuk Prisma
  const data = editorEmails.map(email => ({
    email: email.trim(),
    role: "editor"
  }));

  await prisma.allowedEmail.createMany({ data });

  console.log(`Seeded ${data.length} allowed emails.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });