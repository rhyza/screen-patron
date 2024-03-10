import { Event, Permission, User } from '@prisma/client';
import { prisma } from '~/db.server';

export type { Event } from '@prisma/client';

export async function createEvent(userId: User['id'], name?: string) {
  return prisma.event.create({
    data: {
      hosts: {
        create: [
          {
            userId,
            permission: Permission.ADMIN,
            name,
          },
        ],
      },
    },
  });
}

export async function getEvent(id: Event['id']) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      hosts: true,
      guests: true,
    },
  });
}

export async function updateEvent(id: Event['id'], data: Omit<Event, 'id' | 'createdAt'>) {
  return prisma.event.update({
    where: { id },
    data: { ...data },
  });
}

/**
 * Deletes an Events and cascade deletes all related Hosts and RSVPs.
 */
export async function deleteEvent(id: Event['id']) {
  return prisma.event.delete({
    where: { id },
  });
}
