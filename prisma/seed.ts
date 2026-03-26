import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.allowedEmail.deleteMany({});  // cl ear existing allowed emails

  await prisma.allowedEmail.createMany({ // add allowed emails
    data: [
      { email: "sherinkhaira@gmail.com", role: "editor" },
      { email: "sherinkhairalol@gmail.com", role: "editor" },
    ],
  });

  console.log("seed data made i guess");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
