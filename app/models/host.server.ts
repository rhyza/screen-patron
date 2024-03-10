import { Host } from '@prisma/client';
import { prisma } from '~/db.server';
import { deleteEvent } from './event.server';
import { invariant } from '~/utils';

export type { Host } from '@prisma/client';

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
