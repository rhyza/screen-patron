import type { Host, Rsvp, Status, User } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';

import { prisma, supabase } from '~/db.server';
import { removeHostAllEvents } from './host.server';
import type { EventCardInfo } from './event.server';
import { invariant } from '~/utils';

export type { User } from '@prisma/client';

/**
 * Creates a new user on the auth.users table. A unique email is required. A trigger on
 * the database creates a new User on the public.users table when a user on the auth.users
 * table is verified.
 * @param email An object containing an email property
 * @returns `{ data, error }` with `data` containing a User and Session object
 */
export async function signUp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<any, 'public', any>,
  { email, password }: Partial<Pick<User, 'email'>> & { password: string },
) {
  invariant(email && typeof email === 'string', 'No email provided');
  return client.auth.signUp({
    email,
    password,
  });
}

/**
 * Sends a magic link to the email provided. If User doesn't already exist, creates a new
 * user on the auth.users table. A trigger on the database creates a new User on the
 * public.users table when a user on the auth.users table is verified by having either their
 * email or phone number confirmed.
 * @param email An object containing an email property, a unique email is required
 * @returns An object `{ data, error }` with `data` not containing any usable information
 */
export async function signIn(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: SupabaseClient<any, 'public', any>,
  { email }: Partial<Pick<User, 'email'>>,
  emailRedirect?: string,
) {
  invariant(email && typeof email === 'string', 'No email provided');
  return client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: emailRedirect || 'http://localhost:3000/auth/confirm',
    },
  });
}

/**
 * Logs out the currently logged-in user, removing all items from localstorage and then
 * triggers a "SIGNED_OUT" event.
 * @returns An `{ error }` object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signOut(client?: SupabaseClient<any, 'public', any>) {
  return client ? client.auth.signOut() : supabase.auth.signOut();
}

/**
 * Retrieves info about a User by user's ID.
 * @param id (`userId`)
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @param selection (optional) The specific User fields to return, defaults to full
 * User record without Events unless specified otherwise by `includeEvents`
 * @returns A User record
 */
export async function getUser(
  id: User['id'],
  includeEvents = false,
  selection?: { [key: string]: boolean },
): Promise<User | null> {
  const filter: object = selection
    ? {
        select: {
          ...selection,
          hosting: includeEvents,
          events: includeEvents,
        },
      }
    : {
        include: {
          hosting: includeEvents,
          events: includeEvents,
        },
      };

  return prisma.user.findUnique({
    where: { id },
    ...filter,
  });
}

/**
 * Retrieves info about a User by user's email.
 * @param email
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @returns A User record
 */
export async function getUserByEmail(
  email: User['email'],
  includeEvents = false,
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

/**
 * Retrieves all events a User is hosting or has responded to.
 * @param id (`userId`)
 * @returns An object containing the arrays for a User's Host and RSVP records:
 * > `{ hosting[], events[] }`
 */
export async function getEvents(
  id: User['id'],
): Promise<{ hosting: Host[]; events: Rsvp[] } | null> {
  return prisma.user.findUnique({
    where: { id },
    select: { hosting: true, events: true },
  });
}

/**
 * Retrieves all Events that are being hosted or have been hosted by a User
 * @param id (`userId`)
 * @returns An array of Event records for events the User is hosting with the fields:
 * `{ id, name, photo, dateStart, city, location, cost }`
 */
export async function getEventsHosting(
  id: User['id'],
): Promise<{ past: EventCardInfo[]; future: EventCardInfo[] }> {
  const events = await prisma.event.findMany({
    where: {
      hosts: {
        some: {
          userId: id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      photo: true,
      dateStart: true,
      city: true,
      location: true,
      cost: true,
    },
  });

  const past: EventCardInfo[] = [];
  const future: EventCardInfo[] = [];
  const today = new Date(Date.now());
  today.setHours(0, 0, 0);

  events.map((event) => {
    if (event.dateStart && event.dateStart < today) {
      past.push(event);
    } else {
      future.push(event);
    }
  });

  return { past, future };
}

/**
 * Retrieves all Events a User has RSVP'd to.
 * @param id (`userId`)
 * @returns An array of Event records that the User has answered GOING or MAYBE
 * plus their RSVP response and grouped by date: `{ past, future }`
 */
export async function getEventsResponded(id: User['id']) {
  const events = await prisma.event.findMany({
    where: {
      guests: {
        some: {
          userId: id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      photo: true,
      dateStart: true,
      city: true,
      location: true,
      cost: true,
      guests: {
        where: {
          userId: id,
        },
      },
    },
  });

  // Group events by whether they have or have not already happened
  const past: Array<EventCardInfo & { status: Status }> = [];
  const future: Array<EventCardInfo & { status: Status }> = [];
  const today = new Date(Date.now());
  today.setHours(0, 0, 0);

  events.map((event) => {
    const { guests, ...rest } = event;
    const flattenedEvent: EventCardInfo & { status: Status } = {
      status: guests[0].status,
      ...rest,
    };

    // Filter out all NOT_GOING responses
    if (guests[0].status != 'NOT_GOING') {
      if (rest.dateStart && rest.dateStart < today) {
        past.push(flattenedEvent);
      } else {
        future.push(flattenedEvent);
      }
    }
  });

  return { past, future };
}

/**
 * Updates a User's email or any profile info.
 * @param id (`userId`)
 * @param data An object containing the updated User data: `{ propName: value, ... }`
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @returns The updated User record
 */
export async function updateUser(
  id: User['id'],
  data: Partial<Omit<User, 'id' | 'createdAt'>>,
  includeEvents = false,
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { ...data },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

/**
 * Deletes a User and cascade deletes all related RSVPs. The User is removed as a Host from
 * all Events for which there are other Hosts and those Event records will remain.
 * > If the Host is the only Host for an Event and `deleteSoloHostedEvent` is `false`,
 * then an error is thrown, otherwise those Events are deleted as well.
 * @param id (`userId`)
 * @param deleteSoloHostedEvents (optional) Specifies whether to delete any Event records
 * the User is the sole host for, defaults to `false`
 * @returns The deleted User record
 */
export async function deleteUser(
  id: User['id'],
  deleteSoloHostedEvents = false,
): Promise<User> {
  removeHostAllEvents(id, deleteSoloHostedEvents);

  await supabase.auth.admin.deleteUser(id); // returns { data, errror }

  return prisma.user.delete({
    where: { id },
  });
}
