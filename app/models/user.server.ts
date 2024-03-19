import type { Host, Rsvp, Status, User } from '@prisma/client';
import { prisma, supabase } from '~/db.server';
import { removeHostAllEvents } from './host.server';
import type { EventInfo } from './event.server';
import { invariant } from '~/utils';

export type { User } from '@prisma/client';

/**
 * Creates a new user on the auth.users table. A unique email is required. A trigger on
 * the database creates a new User on the public.users table when a user on the auth.users
 * table is verified.
 * @param email An object containing an email property
 * @returns `{ data, error }` with `data` containing a User and Session object
 */
export async function signUp({ email, password }: Partial<Pick<User, 'email'>> & { password: string }) {
  invariant(email && typeof email === 'string', 'No email provided');
  return supabase.auth.signUp({
    email,
    password,
  })
}

/**
 * Sends a magic link to the email provided. Create a new User if User doesn't already exist.
 * @param email An object containing an email property
 * @returns `{ data, error }` with `data` not containing any usable information
 */
export async function signIn({ email }: Partial<Pick<User, 'email'>>) {
  invariant(email && typeof email === 'string', 'No email provided');
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'http://localhost:3000/events',
    },
  });
}

/**
 * Sends a magic link to the email provided if User already exists. Otherwise sends an email
 * verification link and creates a new user on the auth.users table. A unique email is
 * required. A trigger on the database creates a new User on the public.users table when a
 * user on the auth.users table is verified.
 * @param email An object containing an email property
 * @returns `{ data, error }` with `data` containing a User and Session object
 */
export async function signInOrSignUp({ email }: Partial<Pick<User, 'email'>>) {
  invariant(email && typeof email === 'string', 'No email provided');
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'http://localhost:3000/events',
      shouldCreateUser: false,
    },
  });
  if (error) {
    return supabase.auth.signUp({
      email,
      password: '',
    })
  }
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
}

/**
 * @requires `id` (`userId`)
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @param selection (optional) The specific User fields to return, defaults to full
 * User record without Events unless specified otherwise by `includeEvents`
 * @returns The User record
 */
export async function getUser(
  id: User['id'],
  includeEvents = false,
  selection?: { [key: string]: boolean },
): Promise<User> {
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

  return prisma.user.findUniqueOrThrow({
    where: { id },
    ...filter,
  });
}

/**
 * @requires `email`
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @returns The User record
 */
export async function getUserByEmail(
  email: User['email'],
  includeEvents = false,
): Promise<User> {
  return prisma.user.findUniqueOrThrow({
    where: { email },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

/**
 * @requires `id` (`userId`)
 * @returns The User's list of Host and RSVP records.
 * > `{ hosting[], events[] }`
 */
export async function getEvents(
  id: User['id'],
): Promise<{ hosting: Host[]; events: Rsvp[] }> {
  return prisma.user.findUniqueOrThrow({
    where: { id },
    select: { hosting: true, events: true },
  });
}

/**
 * @requires `id` (`userId`)
 * @returns The User's list of Event records for Events the User is hosting with the fields:
 * `{ id, name, photo, dateStart, city, location, cost }`
 */
export async function getEventsHosting(
  id: User['id'],
): Promise<{ past: EventInfo[]; future: EventInfo[] }> {
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

  const past: EventInfo[] = [];
  const future: EventInfo[] = [];
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
 * @requires `id` (`userId`)
 * @returns The User's list of Event records for Events the User has answered GOING or MAYBE
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

  const past: Array<EventInfo & { status: Status }> = [];
  const future: Array<EventInfo & { status: Status }> = [];
  const today = new Date(Date.now());
  today.setHours(0, 0, 0);

  events.map((event) => {
    const { guests, ...rest } = event;
    const flattenedEvent: EventInfo & { status: Status } = {
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
 * @requires `id` (`userId`), `data`
 * > `data: { propName: value, ... }`
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
 * @requires `id` (`userId`)
 * @param deleteSoloHostedEvents (optional) Specifies whether to delete any Event records
 * the User is the sole host for, defaults to `false`
 * @returns The deleted User record
 */
export async function deleteUser(
  id: User['id'],
  deleteSoloHostedEvents = false,
): Promise<User> {
  removeHostAllEvents(id, deleteSoloHostedEvents);

  const { data, error } = await supabase.auth.admin.deleteUser(id);

  return prisma.user.delete({
    where: { id },
  });
}
