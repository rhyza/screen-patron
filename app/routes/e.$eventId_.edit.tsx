import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventForm from '~/components/EventForm';
import { eventPlaceholderImage, eventsStoragePath } from '~/assets';
import { getSession, getSupabaseServerClient, uploadImage, deleteImage } from '~/db.server';
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
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || !session?.user?.id) {
    // User not signed in
    throw redirect(`/e/${params.eventId}`, 302);
  }

  const host = await isHost(params.eventId, session.user.id);
  if (!host) {
    // User is not a host of this event
    throw redirect(`/e/${params.eventId}`, 302);
  }

  const formData = await request.formData();
  let { photo, prevPhoto, ...updates } = Object.fromEntries(formData);

  // Check if user added new photo
  if (typeof photo === 'object' && photo.size != 0) {
    // Try to upload new photo to storage, wait for returned public url
    const { path, error } = await uploadImage(
      supabase,
      'events',
      `${params.eventId}_${Date.now()}`,
      photo,
    );

    if (!error) {
      // If no errors, update the photo URL
      updates = { ...updates, photo: path };

      // And delete the old photo if one exists
      if (prevPhoto && typeof prevPhoto === 'string' && prevPhoto != eventPlaceholderImage) {
        const prevPhotoPath = prevPhoto.slice(eventsStoragePath.length);
        deleteImage(supabase, 'events', prevPhotoPath);
      }
    } else {
      console.log(error);
    }
  }

  await updateEvent(params.eventId, updates);
  return redirect(`/e/${params.eventId}`);
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const event: Partial<Event> | null = await getEvent(params.eventId);
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || !session?.user?.id) {
    // User not signed in
    throw redirect(`/e/${params.eventId}`, 302);
  }

  const host = await isHost(params.eventId, session.user.id);
  if (!host) {
    // User is not a host of this event
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
