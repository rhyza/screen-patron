import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventForm from '~/components/EventForm';
import { getSession, getSupabaseServerClient } from '~/db.server';
import { Event, getEvent, updateEvent } from '~/models/event.server';
import { isHost } from '~/models/host.server';
import { invariant, retypeNull } from '~/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Edit Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateEvent(params.eventId, updates);
  return redirect(`/e/${params.eventId}`);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const event: Partial<Event> = await getEvent(params.eventId);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  invariant(session?.user?.id, 'User not signed in');
  const host = await isHost(params.eventId, session.user.id);
  if (!session || !host) {
    throw redirect(`/e/${params.eventId}`, 302);
  }

  return json({ event });
};

/**
 * `/e/$eventId/edit` — Page for editing an existing Event.
 */
export default function EditEvent() {
  const { event } = useLoaderData<typeof loader>();

  return <EventForm {...retypeNull(event)} />;
}
