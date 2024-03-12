import { Event, Host, Rsvp, Status, User } from '@prisma/client';
import { prisma } from '~/db.server';
import { deleteEvent } from './event.server';
import { invariant } from '~/utils';

export type { Host } from '@prisma/client';
export type HostInfo = {
  eventId?: string;
  userId?: string;
  name?: string | null;
  profileName?: string | null;
  profilePhoto?: string | null;
};

/**
 * Adds a User as a Host to an Event.
 * @requires `eventId`, `userId`
 * @param name (optional) The display name for Host
 * @returns [ the Host record created, the updated Event record, the updated User record ]
 */
export async function addHost(
  eventId: Host['eventId'],
  userId: Host['userId'],
  name?: Host['name'],
): Promise<[Host, Event, User]> {
  // Create new Host record
  const createHost = prisma.host.create({
    data: {
      eventId,
      userId,
      name,
    },
  });

  // Connect Host record to its Event and User
  const connectEvent = prisma.event.update({
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

  const connectUser = prisma.user.update({
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

  return prisma.$transaction([createHost, connectEvent, connectUser]);
}

/**
 * @requires `eventId`, `userId`
 * @returns The Host record for a specific Event and User along with the User's profile name
 * and profile photo
 */
export async function getHost(eventId: Host['eventId'], userId: Host['userId']): Promise<HostInfo> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      name: true,
      photo: true,
      hosting: {
        where: {
          eventId,
        },
      },
    },
  });

  return { profileName: user?.name, profilePhoto: user?.photo, ...user?.hosting[0] };
}

/**
 * @requires `eventId`
 * @returns The list of Host reocrds for an Event along with each User's profile name and
 * profile photo
 */
export async function getHosts(eventId: Host['eventId']): Promise<HostInfo[]> {
  const users = await prisma.user.findMany({
    where: {
      hosting: {
        some: {
          eventId,
        },
      },
    },
    select: {
      name: true,
      photo: true,
      hosting: {
        where: {
          eventId,
        },
      },
    },
  });

  return users.map((user) => ({
    profileName: user.name,
    profilePhoto: user.photo,
    ...user.hosting[0],
  }));
}

/**
 * Updates any of a Host's info.
 * @requires `eventId`, `userId`, `data`
 * > `data: { propName: value, ... }`
 * @returns The updated Host record
 */
export async function updateHost(
  eventId: Host['eventId'],
  userId: Host['userId'],
  data: Partial<Omit<Host, 'eventId' | 'userId'>>,
): Promise<Host> {
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
 * Removes a User from an Event's guest list, and instead adds them as a host.
 * The associated RSVP record is deleted and the newly created Host record is returned.
 * @requires `eventId`, `userId`
 * @returns The newly created Host record
 */
export async function promoteToHost(
  eventId: Host['eventId'],
  userId: Host['userId'],
  name?: Host['name'],
): Promise<Host> {
  const guest = await prisma.rsvp.delete({
    where: {
      id: { eventId, userId },
    },
    select: {
      name: true,
    },
  });
  // Use User's display name from their RSVP record if new display name not specified
  name = name || guest?.name;

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
  name?: Host['name'],
): Promise<Rsvp> {
  // Retrieve User's display name from Host record if new display name not specified
  if (!name) {
    const host = await prisma.host.findUniqueOrThrow({
      where: {
        id: { eventId, userId },
      },
      select: {
        name: true,
      },
    });
    name = name || host?.name;
  }

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
): Promise<Event> {
  const event = await prisma.event.findUniqueOrThrow({
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
  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      hosts: {
        delete: {
          id: { eventId, userId },
        },
      },
    },
    include: {
      hosts: true,
      guests: true,
    },
  });
}

/**
 * Removes a User as a Host from all Events the User is a Host for.
 * > If the Host is the only Host for an Event and `deleteSoloHostedEvent` is `false`,
 * then an error is thrown, otherwise those Events are deleted.
 * @requires `userId`
 * @param deleteSoloHostedEvent (optional) Specifies whether to delete any Event records
 * the User is the sole host for, defaults to `false`
 * @returns nothing
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
    },
  });

  // Check if the user is the sole host for any events and if such events should be deleted.
  invariant(
    !(numSoloEvents > 0 && !deleteSoloHostedEvent),
    'This host is the only host for an event. You must add another host before you can remove the selected host.',
  );

  const deleteHosts = prisma.host.deleteMany({
    where: {
      userId,
    },
  });

  const deleteEvents = prisma.event.deleteMany({
    where: {
      hosts: {
        every: {
          userId,
        },
      },
    },
  });

  if (deleteSoloHostedEvent) {
    // Delete solo hosted Events if allowed
    return prisma.$transaction([deleteEvents, deleteHosts]);
  } else {
    // Delete all of User's remaining Host records
    return deleteHosts;
  }
}
