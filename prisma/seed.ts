import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const email = 'rachel@remix.run';
  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const user = await prisma.user.create({
    data: {
      id: 'test',
      email,
    },
  });

  await prisma.user.create({
    data: {
      id: 'test',
      email: 'test@gmail.com',
    },
  });

  await prisma.event.create({
    data: {
      name: 'My first event',
      hosts: {
        create: [{ userId: user.id }],
      },
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
