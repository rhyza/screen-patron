import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import UserForm from '~/components/UserForm';
import { getSession, getSupabaseServerClient } from '~/db.server';
import { getUser, updateUser, User } from '~/models/user.server';
import { invariant, retypeNull } from '~/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Edit Profile | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateUser(params.userId, updates);
  return redirect(`/user/${params.userId}`);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const user: User | null = await getUser(params.userId);
  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || session?.user?.id != params.userId) {
    throw redirect(`/user/${params.userId}`, 302);
  }

  return json({ session, user });
};

/**
 * `/user/$userId/edit` — Page for editing an existing User's profile.
 */
export default function EditUser() {
  const { user } = useLoaderData<typeof loader>();

  return <UserForm {...retypeNull(user)} />;
}
