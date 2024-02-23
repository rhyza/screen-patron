// @ts-expect-error - no types, but it's a tiny function
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import { invariant } from '../utils';

type UserMutation = {
  id?: string;
  name?: string;
  avatar?: string;
  bio?: string;
  screenings?: string[];
};

export type UserRecord = UserMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeUsers = {
  records: {} as Record<string, UserRecord>,

  async getAll(): Promise<UserRecord[]> {
    return Object.keys(fakeUsers.records)
      .map((key) => fakeUsers.records[key])
      .sort(sortBy('-createdAt', 'name'));
  },

  async get(id: string): Promise<UserRecord | null> {
    return fakeUsers.records[id] || null;
  },

  async create(values: UserMutation): Promise<UserRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newUser = { id, createdAt, ...values };
    fakeUsers.records[id] = newUser;
    return newUser;
  },

  async set(id: string, values: UserMutation): Promise<UserRecord> {
    const user = await fakeUsers.get(id);
    invariant(user, `No user found for ${id}`);
    const updatedUser = { ...user, ...values };
    fakeUsers.records[id] = updatedUser;
    return updatedUser;
  },

  destroy(id: string): null {
    delete fakeUsers.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getUsers(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let users = await fakeUsers.getAll();
  /*if (query) {
    users = matchSorter(users, query, {
      keys: ['name'],
    });
  }*/
  return users.sort(sortBy('createdAt', 'name'));
}

export async function createEmptyUser() {
  const user = await fakeUsers.create({});
  return user;
}

export async function getUser(id: string) {
  return fakeUsers.get(id);
}

export async function updateUser(id: string, updates: UserMutation) {
  const user = await fakeUsers.get(id);
  if (!user) {
    throw new Error(`No user found for ${id}`);
  }
  await fakeUsers.set(id, { ...user, ...updates });
  return user;
}

export async function deleteUser(id: string) {
  fakeUsers.destroy(id);
}

[
  {
    avatar:
      'https://sessionize.com/image/124e-400o400o2-wHVdAuNaxi8KJrgtN3ZKci.jpg',
    name: 'Shruti Kapoor',
    bio: '@shrutikapoor08',
  },
  {
    avatar:
      'https://sessionize.com/image/1940-400o400o2-Enh9dnYmrLYhJSTTPSw3MH.jpg',
    name: 'Glenn Reyes',
    bio: '@glnnrys',
  },
  {
    avatar:
      'https://sessionize.com/image/9273-400o400o2-3tyrUE3HjsCHJLU5aUJCja.jpg',
    name: 'Ryan Florence',
  },
  {
    avatar:
      'https://sessionize.com/image/d14d-400o400o2-pyB229HyFPCnUcZhHf3kWS.png',
    name: 'Oscar Newman',
    bio: '@__oscarnewman',
  },
  {
    avatar:
      'https://sessionize.com/image/fd45-400o400o2-fw91uCdGU9hFP334dnyVCr.jpg',
    name: 'Michael Jackson',
  },
  {
    avatar:
      'https://sessionize.com/image/b07e-400o400o2-KgNRF3S9sD5ZR4UsG7hG4g.jpg',
    name: 'Christopher Chedeau',
    bio: '@Vjeux',
  },
  {
    avatar:
      'https://sessionize.com/image/262f-400o400o2-UBPQueK3fayaCmsyUc1Ljf.jpg',
    name: 'Cameron Matheson',
    bio: '@cmatheson',
  },
  {
    avatar:
      'https://sessionize.com/image/820b-400o400o2-Ja1KDrBAu5NzYTPLSC3GW8.jpg',
    name: 'Brooks Lybrand',
    bio: '@BrooksLybrand',
  },
  {
    avatar:
      'https://sessionize.com/image/df38-400o400o2-JwbChVUj6V7DwZMc9vJEHc.jpg',
    name: 'Alex Anderson',
    bio: '@ralex1993',
  },
  {
    avatar:
      'https://sessionize.com/image/5578-400o400o2-BMT43t5kd2U1XstaNnM6Ax.jpg',
    name: 'Kent C. Dodds',
    bio: '@kentcdodds',
  },
  {
    avatar:
      'https://sessionize.com/image/c9d5-400o400o2-Sri5qnQmscaJXVB8m3VBgf.jpg',
    name: 'Nevi Shah',
    bio: '@nevikashah',
  },
  {
    avatar:
      'https://sessionize.com/image/2694-400o400o2-MYYTsnszbLKTzyqJV17w2q.png',
    name: 'Andrew Petersen',
  },
  {
    avatar:
      'https://sessionize.com/image/907a-400o400o2-9TM2CCmvrw6ttmJiTw4Lz8.jpg',
    name: 'Scott Smerchek',
    bio: '@smerchek',
  },
  {
    avatar:
      'https://sessionize.com/image/08be-400o400o2-WtYGFFR1ZUJHL9tKyVBNPV.jpg',
    name: 'Giovanni Benussi',
    bio: '@giovannibenussi',
  },
  {
    avatar:
      'https://sessionize.com/image/f814-400o400o2-n2ua5nM9qwZA2hiGdr1T7N.jpg',
    name: 'Igor Minar',
    bio: '@IgorMinar',
  },
  {
    avatar:
      'https://sessionize.com/image/fb82-400o400o2-LbvwhTVMrYLDdN3z4iEFMp.jpeg',
    name: 'Brandon Kish',
  },
  {
    avatar:
      'https://sessionize.com/image/fcda-400o400o2-XiYRtKK5Dvng5AeyC8PiUA.png',
    name: 'Arisa Fukuzaki',
    bio: '@arisa_dev',
  },
  {
    avatar:
      'https://sessionize.com/image/c8c3-400o400o2-PR5UsgApAVEADZRixV4H8e.jpeg',
    name: 'Alexandra Spalato',
    bio: '@alexadark',
  },
  {
    avatar:
      'https://sessionize.com/image/7594-400o400o2-hWtdCjbdFdLgE2vEXBJtyo.jpg',
    name: 'Cat Johnson',
  },
  {
    avatar:
      'https://sessionize.com/image/5636-400o400o2-TWgi8vELMFoB3hB9uPw62d.jpg',
    name: 'Ashley Narcisse',
    bio: '@_darkfadr',
  },
  {
    avatar:
      'https://sessionize.com/image/6aeb-400o400o2-Q5tAiuzKGgzSje9ZsK3Yu5.JPG',
    name: 'Edmund Hung',
    bio: '@_edmundhung',
  },
  {
    avatar:
      'https://sessionize.com/image/30f1-400o400o2-wJBdJ6sFayjKmJycYKoHSe.jpg',
    name: 'Clifford Fajardo',
    bio: '@cliffordfajard0',
  },
  {
    avatar:
      'https://sessionize.com/image/6faa-400o400o2-amseBRDkdg7wSK5tjsFDiG.jpg',
    name: 'Erick Tamayo',
    bio: '@ericktamayo',
  },
  {
    avatar:
      'https://sessionize.com/image/feba-400o400o2-R4GE7eqegJNFf3cQ567obs.jpg',
    name: 'Paul Bratslavsky',
    bio: '@codingthirty',
  },
  {
    avatar:
      'https://sessionize.com/image/c315-400o400o2-spjM5A6VVfVNnQsuwvX3DY.jpg',
    name: 'Pedro Cattori',
    bio: '@pcattori',
  },
  {
    avatar:
      'https://sessionize.com/image/eec1-400o400o2-HkvWKLFqecmFxLwqR9KMRw.jpg',
    name: 'Andre Landgraf',
    bio: '@AndreLandgraf94',
  },
  {
    avatar:
      'https://sessionize.com/image/c73a-400o400o2-4MTaTq6ftC15hqwtqUJmTC.jpg',
    name: 'Monica Powell',
    bio: '@indigitalcolor',
  },
  {
    avatar:
      'https://sessionize.com/image/cef7-400o400o2-KBZUydbjfkfGACQmjbHEvX.jpeg',
    name: 'Brian Lee',
    bio: '@brian_dlee',
  },
  {
    avatar:
      'https://sessionize.com/image/f83b-400o400o2-Pyw3chmeHMxGsNoj3nQmWU.jpg',
    name: 'Sean McQuaid',
    bio: '@SeanMcQuaidCode',
  },
  {
    avatar:
      'https://sessionize.com/image/a9fc-400o400o2-JHBnWZRoxp7QX74Hdac7AZ.jpg',
    name: 'Shane Walker',
    bio: '@swalker326',
  },
  {
    avatar:
      'https://sessionize.com/image/6644-400o400o2-aHnGHb5Pdu3D32MbfrnQbj.jpg',
    name: 'Jon Jensen',
    bio: '@jenseng',
  },
].forEach((user) => {
  fakeUsers.create({
    ...user,
    id: `${user.name.toLowerCase().replace(/\s/g, '-')}`,
  });
});