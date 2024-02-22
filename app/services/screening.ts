// @ts-expect-error - no types, but it's a tiny function
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import { invariant } from '../utils';

type ScreeningMutation = {
  id?: string;
  name?: string;
  coverImage?: string;
  description?: string;
  hosts?: string[];
  guests?: string[];
  location?: string;
  dateStart?: string;
  dateEnd?: string;
  cost?: number;
};

export type ScreeningRecord = ScreeningMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
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

export async function createEmptyScreening() {
  const screening = await fakeScreenings.create({});
  return screening;
}

export async function getScreening(id: string) {
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

[
  {
    coverImage:
      'https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg',
    name: 'Shruti Kapoor\'s Screening',
    description: '@shrutikapoor08',
    location: 'Copley Square Theater',
    dateStart: '2024-02-22T23:30',
    dateEnd: '2024-02-22T20:30',
    cost: 5,
  },
  {
    coverImage:
      'https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg',
    name: 'Glenn Reyes\'s Screening',
    description: '@glnnrys',
    location: 'My House',
    dateStart: '2024-02-22T23:30',
    dateEnd: '2024-02-21T01:30',
  },
  {
    coverImage:
      'https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg',
    name: 'Ryan Florence\'s Screening',
    location: 'Somewhere Theater',
    dateStart: '2025-02-22T23:30',
    dateEnd: '2025-02-22T20:30',
    cost: 20,
  },
  {
    coverImage:
      'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png',
    name: 'Oscar Newman\'s Screening',
    description: '@__oscarnewman',
    location: 'New Years Theater',
    dateStart: '2024-12-31T21:00',
    dateEnd: '2025-01-01T03:00',
    cost: 25,
  },
  {
    coverImage:
      'https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg',
    name: 'Michael Jackson\'s Screening',
  },
].forEach((screening) => {
  fakeScreenings.create({
    ...screening,
    id: `${screening.name.toLowerCase().replace(/\s/g, '-')}`,
  });
});
