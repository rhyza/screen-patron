// @ts-expect-error - no types, but it's a tiny function
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import { invariant } from '../utils';

type Guest = {
  id: string;
  status: string;
  name?: string | undefined;
  avatar?: string | undefined;
}

type ScreeningMutation = {
  id?: string;
  name?: string;
  coverImage?: string;
  description?: string;
  hosts?: Record<string, Guest>;
  guests?: Record<string, Guest>;
  location?: string;
  dateStart?: string;
  dateEnd?: string;
  cost?: number;
  capacity?: number;
  private?: boolean;
};

export type ScreeningRecord = ScreeningMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app we'd be talking to a real db or
// fetching from an existing API.
const fakeScreenings = {
  records: {} as Record<string, ScreeningRecord>,

  async getAll(): Promise<ScreeningRecord[]> {
    return Object.keys(fakeScreenings.records)
      .map((key) => fakeScreenings.records[key])
      .sort(sortBy('-createdAt', 'name'));
  },

  async get(id: string): Promise<ScreeningRecord | null> {
    return fakeScreenings.records[id] || null;
  },

  async create(values: ScreeningMutation): Promise<ScreeningRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newScreening = { id, createdAt, ...values };
    fakeScreenings.records[id] = newScreening;
    return newScreening;
  },

  async set(id: string, values: ScreeningMutation): Promise<ScreeningRecord> {
    const screening = await fakeScreenings.get(id);
    invariant(screening, `No screening found for ${id}`);
    const updatedScreening = { ...screening, ...values };
    fakeScreenings.records[id] = updatedScreening;
    return updatedScreening;
  },

  destroy(id: string): null {
    delete fakeScreenings.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getScreenings(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let screenings = await fakeScreenings.getAll();
  /*if (query) {
    screenings = matchSorter(screenings, query, {
      keys: ['name'],
    });
  }*/
  return screenings.sort(sortBy('createdAt', 'name'));
}

export async function createScreening(values: ScreeningMutation) {
  const screening = await fakeScreenings.create({...values, guests: {}});
  return screening;
}

export async function getScreening(id: string | undefined) {
  if (!id) {
    return null;
  }
  return fakeScreenings.get(id);
}

export async function updateScreening(id: string, updates: ScreeningMutation) {
  const screening = await fakeScreenings.get(id);
  if (!screening) {
    throw new Error(`No screening found for ${id}`);
  }
  await fakeScreenings.set(id, { ...screening, ...updates });
  return screening;
}

export async function deleteScreening(id: string) {
  fakeScreenings.destroy(id);
}

export async function updateGuestList(
  screeningId: string, guestId: string, status: string, name?: string, avatar?: string
) {
  const screening = await fakeScreenings.get(screeningId);
  if (!screening) {
    throw new Error(`No screening found for ${screeningId}`);
  }
  let guests = screening.guests || {};
  if (guests && status === 'not going') {
    delete guests[guestId];
  } else {
    guests[guestId] = {
      id: guestId,
      status: status,
      name: name,
      avatar: avatar,
    };
  }
  await fakeScreenings.set(screeningId, { guests: guests, ...screening });
  return { ...guests };
}

export function getGuestCount(guests: Record<string, Guest> | undefined) {
  let going = 0;
  let maybe = 0;
  for (let id in guests) {
    let guest = guests[id];
    if (guest.status === 'going') {
      going++;
    } else if (guest.status === 'maybe') {
      maybe++;
    }
  }
  return { going: going, maybe: maybe, total: going + maybe};
}

[
  {
    coverImage:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    name: 'Shruti Kapoor\'s Screening',
    description: '@shrutikapoor08',
    location: 'Copley Square Theater',
    dateStart: '2024-02-22T23:30',
    dateEnd: '2024-02-22T20:30',
    cost: 5,
    hosts: getHostsRecord('shrutikapoor08', 'Shruti Kapoor', 'https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg'),
    guests: getFakeGuestList(18, 5),
  },
  {
    coverImage:
      'https://plus.unsplash.com/premium_photo-1682125157065-cbc4eb0fe0bb',
    name: 'Glenn Reyes\'s Screening',
    description: '@glnnrys',
    location: 'My House',
    dateStart: '2024-02-22T23:30',
    dateEnd: '2024-02-21T01:30',
    hosts:
      getHostsRecord(
        'glnnrys',
        'Glenn Reyes',
        'https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg'
      ),
    guests: getFakeGuestList(2, 1),
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1511875762315-c773eb98eec0',
    name: 'Ryan Florence\'s Screening',
    location: 'Somewhere Theater',
    dateStart: '2025-02-22T23:30',
    dateEnd: '2025-02-22T20:30',
    capacity: 100,
    cost: 20,
    hosts:
      getHostsRecord(
        'ryan-florence',
        'Ryan Florence',
        'https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg'
      ),
    guests: getFakeGuestList(32, 12),
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1611419010196-a360856fc42f',
    name: 'Oscar Newman\'s Screening',
    description: '@__oscarnewman',
    location: 'New Years Theater',
    dateStart: '2024-12-31T21:00',
    dateEnd: '2025-01-01T03:00',
    cost: 25,
    hosts:
      getHostsRecord(
        'oscarnewman',
        'Oscar Newman',
        'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png'
      ),
    guests: getFakeGuestList(3, 3),
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3',
    name: 'Michael Jackson\'s Screening',
    hosts:
      getHostsRecord(
        'michael-jackson',
        'Michael Jackson',
        'https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg'
      ),
  },
  {
    coverImage:
      'https://images.unsplash.com/photo-1709040567086-ee176caa99f9',
    name: 'Oscar Newman\'s 2nd Screening',
    description: '@__oscarnewman',
    location: 'New Years Theater',
    dateStart: '2024-12-31T21:00',
    dateEnd: '2025-01-01T03:00',
    cost: 25,
    hosts:
      getHostsRecord(
        'oscarnewman',
        'Oscar Newman',
        'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png'
      ),
    guests: getFakeGuestList(3, 3),
  },
].forEach((screening) => {
  fakeScreenings.create({
    ...screening,
    id: `${screening.name.toLowerCase().replace(/\s/g, '-')}`,
  });
});

fakeScreenings.create({
  id: 'test',
  name: 'Unnamed Event',
  location: 'Unnamed Location',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  coverImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580',
  guests: getFakeGuestList(),
});

function getHostsRecord(id: string, name?: string, avatar?: string): Record<string, Guest> {
  const hostList: Record<string, Guest> = {};
  hostList[id] = {
    id: id,
    status: 'going',
    name: name,
    avatar: avatar,
  } as const;
  return hostList;
}

export function getFakeGuestList(going = 14, maybe = 2): Record<string, Guest> {
  const guestList: Record<string, Guest> = {};
  const avatarList = [
    'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    'https://i.pravatar.cc/150?u=a04258a2462d826712d',
    'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    'https://i.pravatar.cc/150?u=a04258114e29026302d',
    'https://i.pravatar.cc/150?u=a04258114e29026702d',
    'https://i.pravatar.cc/150?u=a04258114e29026708c',
    'https://avatars.githubusercontent.com/u/30373425',
    'https://i.pravatar.cc/300?u=a042581f4e29026709d',
  ];
  const nameList = [
    'Alex',
    'Charlie',
    'Jesse',
    'Aiden',
    'Riley',
    'Luca',
    'Jade',
    'River',
  ];
  for (let i = 0; i < going + maybe; i++) {
    let id = i < going ? `going-${i}` : `maybe-${i}`;
    guestList[id] = {
      id: id,
      status: i < going ? 'going' : 'maybe',
      name: i < nameList.length ? nameList[i] : undefined,
      avatar: i < avatarList.length ? avatarList[i] : undefined,
    } as const;
  }
  return guestList;
}