import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventForm from '~/components/EventForm';
import { Event, getEvent, updateEvent } from '~/models/event.server';
import { invariant, retypeNull } from '~/utils';

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateEvent(params.eventId, updates);
  return redirect(`/e/${params.eventId}`);
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const event: Partial<Event> = await getEvent(params.eventId);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }
  return json({ event });
};

export default function EditEvent() {
  const { event } = useLoaderData<typeof loader>();

  return <EventForm {...retypeNull(event)} />;
}
