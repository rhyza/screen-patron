import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const email = 'test@test.com';
  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.user.create({
    data: {
      id: 'test',
      email,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
