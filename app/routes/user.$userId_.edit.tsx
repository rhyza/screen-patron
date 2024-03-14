import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import UserForm from '~/components/UserForm';
import { getUser, updateUser, User } from '~/models/user.server';
import { invariant, retypeNull } from '~/utils';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateUser(params.userId, updates);
  return redirect(`/user/${params.userId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.userId, 'Missing userId param');
  const user: User | null = await getUser(params.userId);
  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ user });
};

export default function EditUser() {
  const { user } = useLoaderData<typeof loader>();

  return <UserForm {...retypeNull(user)} />;
}
