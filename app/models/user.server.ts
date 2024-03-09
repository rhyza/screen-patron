import type { User } from '@prisma/client';
import { prisma } from '~/db.server';

export type { User } from '@prisma/client';

export async function createUser(email: User['email']) {
  return prisma.user.create({
    data: {
      email,
    },
  });
}

export async function getUser(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

export async function updateUser(id: User['id'], data: Omit<User, 'id' | 'createdAt'>) {
  return prisma.user.update({
    where: { id },
    data: { ...data },
  });
}

export async function deleteUser(id: User['id']) {
  return prisma.user.delete({ where: { id } });
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } });
}
