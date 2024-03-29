import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';

import UserProfile from '~/layouts/UserProfile';

import type { OutletContext } from '~/db.server';
import type { User } from '~/models/user.server';
import { getUser } from '~/models/user.server';
import { invariant } from '~/utils';

export const meta: MetaFunction = () => {
  return [{ title: 'Screen Patron' }, { name: 'description', content: 'DIY Film Events' }];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const user: User | null = await getUser(params.userId);
  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ user });
};

/**
 * `/user/$userId` — Page displaying a User's profile.
 */
export default function UserPage() {
  const {
    user: { id, name, photo, bio, instagram, twitter, website },
  } = useLoaderData<typeof loader>();
  const session = useOutletContext<OutletContext>();

  return (
    <div className="page-container">
      <UserProfile
        name={name}
        photo={photo}
        bio={bio}
        instagram={instagram}
        twitter={twitter}
        website={website}
        isUser={session?.user?.id === id}
      />
    </div>
  );
}
