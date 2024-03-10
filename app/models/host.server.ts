import { Host } from '@prisma/client';
import { prisma } from '~/db.server';
import { deleteEvent } from './event.server';
import { invariant } from '~/utils';

export type { Host } from '@prisma/client';

/**
 * Adds a User as a Host to an Event.
 */
export async function addHost(
  eventId: Host['eventId'],
  userId: Host['userId'],
  name?: Host['name'],
) {
  // Create new Host record
  const host = prisma.host.create({
    data: {
      eventId,
      userId,
      name,
    },
  });

  // Connect Host record to its Event and User
  prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      hosts: {
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
      hosting: {
        connect: {
          id: { eventId, userId },
        },
      },
    },
  });

  return host;
}

/**
 * Returns Host info along with User's name and photo.
 */
export async function getGuest(eventId: Host['eventId'], userId: Host['userId']) {
  return prisma.user.findFirst({
    select: {
      name: true,
      photo: true,
      events: {
        where: {
          eventId,
          userId,
        },
      },
    },
  });
}

export async function updateHost(
  eventId: Host['eventId'],
  userId: Host['userId'],
  data: Omit<Host, 'eventId' | 'userId'>,
) {
  return prisma.host.update({
    where: {
      id: {
        eventId,
        userId,
      },
    },
    data: {
      ...data,
    },
  });
}

/**
 * Removes a User from an Event's guest list, and instead adds them as a Host.
 * The associated RSVP record is deleted and the newly created Host record is returned.
 * @requires `eventId`, `userId`
 * @returns The newly created Host record
 */
export async function promoteToHost(eventId: Host['eventId'], userId: Host['userId']) {
  const guest = await prisma.rsvp.delete({
    where: {
      id: { eventId, userId },
    },
    select: {
      name: true,
    },
  });
  const name = guest?.name;

  return prisma.host.create({
    data: {
      eventId,
      userId,
      name,
    },
  });
}

/**
 * Removes a User as an Event's host, and instead adds them to the Event's guest list along
 * with an RSVP response.
 * The associated Host record is deleted and the newly created RSVP record is returned.
 * > If the User is the only Host for the Event then an error is thrown.
 * @requires `eventId`, `userId`
 * @param status (optional) The User's RSVP response, defaults to `Status.GOING`
 * @returns The newly created RSVP record
 */
export async function demoteToGuest(
  eventId: Host['eventId'],
  userId: Host['userId'],
  status = Status.GOING,
) {
  const host = await prisma.host.findUnique({
    where: {
      id: { eventId, userId },
    },
    select: {
      name: true,
    },
  });
  const name = host?.name;
  removeHost(eventId, userId);

  return prisma.rsvp.create({
    data: {
      eventId,
      userId,
      status,
      name,
    },
  });
}

/**
 * Removes a Host from an Event.
 * > If the Host is the only Host for the Event and `deleteSoloHostedEvent` is `false`,
 * then an error is thrown.
 * @requires `eventId`, `userId`
 * @param deleteSoloHostedEvent (optional) Specifies whether to delete the Event record if
 * the User is the sole host, defaults to `false`
 * @returns The Event record that was updated or deleted
 */
export async function removeHost(
  eventId: Host['eventId'],
  userId: Host['userId'],
  deleteSoloHostedEvent = false,
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { hosts: true },
  });

  const hosts = event?.hosts;
  invariant(hosts, 'There are no hosts associated with this event.');

  // Check if user is a host for this event.
  invariant(
    hosts.filter((host) => host.userId === userId).length === 0,
    'This user is not a host for this event.',
  );

  // User is the only host for this event.
  if (hosts.length === 1 && deleteSoloHostedEvent) {
    return deleteEvent(eventId);
  }
  invariant(
    hosts.length > 1,
    'This host is the only host for this event. You must add another host before you can remove the selected host.',
  );

  // User is not the only host for this event.
  return prisma.host.delete({
    where: {
      id: { eventId, userId },
    },
  });
}

/**
 * Remove a User as a Host from all Events the User is a Host for. If the Host is the only
 * Host for an Event, then an error is thrown unless otherwise specified by
 * `deleteSoloHostedEvent`.
 * @param userId User to remove as Host
 * @param deleteSoloHostedEvent Defaults to `false`. If `true`, deletes all Events that the
 * User is the only Host for.
 */
export async function removeHostAllEvents(
  userId: Host['userId'],
  deleteSoloHostedEvent = false,
) {
  // Counts all events where every host in hosts has this userId
  const numSoloEvents = await prisma.event.count({
    where: {
      hosts: {
        every: {
          userId,
        },
      },
    }
  });

  // Check if the user is the sole host for any events and if such events should be deleted.
  invariant(
    !(numSoloEvents > 0 && !deleteSoloHostedEvent),
    'This host is the only host for this event. You must add another host before you can remove the selected host.',
  );

  if (deleteSoloHostedEvent) {
    prisma.event.deleteMany({
      where: {
        hosts: {
          every: {
            userId,
          },
        },
      },
    });
  }
}
