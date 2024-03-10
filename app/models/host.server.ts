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
 * Remove a Host from an Event. If the Host is the only Host for an Event, then an error is
 * thrown unless otherwise specified.
 * @param eventId Event to remove Host from
 * @param userId User to remove as Host from Event
 * @param deleteSoloHostedEvent Defaults to false. If true, deletes the Event if the User is
 * the only Host for the Event, and returns the deleted Event.
 * @returns Host that was removed, unless Host was the sole host and deleteSoloHostedEvent is
 * true, then returns the Event deleted.
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
