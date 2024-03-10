import type { Event, Host, Rsvp, Status, User } from '@prisma/client';
import { prisma } from '~/db.server';

export type { Host, Rsvp } from '@prisma/client';

export async function addGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
  status: Status,
  name?: Rsvp['name'],
) {
  // Create new Rsvp record
  const guest = prisma.rsvp.create({
    data: {
      eventId,
      userId,
      status,
      name,
    },
  });

  // Connect Host record to its Event and User
  prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      guests: {
        connect: {
          id: { eventId, userId },
        },
      },
    },
  });
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      events: {
        connect: {
          id: { eventId, userId },
        },
      },
    },
  });

  return guest;
}
