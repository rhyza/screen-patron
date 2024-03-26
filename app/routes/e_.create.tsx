import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import EventForm from '~/components/EventForm';
import { getSession, getSupabaseServerClient, uploadImage } from '~/db.server';
import { createEvent, updateEvent } from '~/models/event.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create a New Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

/**
 * `e/create` — Page for creating a new Event.
 */
export default function CreateEvent() {
  return <EventForm />;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = request.formData();

  // Check if user is signed in
  const { supabase } = getSupabaseServerClient(request);
  const session = await getSession(supabase);
  if (!session || !session?.user?.id) {
    throw redirect(`/signin`, 302);
  }

  // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
  let { photo, prevPhoto, ...updates } = Object.fromEntries(await formData);
  const event = await createEvent(session?.user?.id, { ...updates });

  // Need eventId before photo can be uploaded, check if user added a photo
  if (typeof photo === 'object' && photo.size != 0) {
    // Try to upload the photo to storage, wait for returned public url
    const { path, error } = await uploadImage(
      supabase,
      'events',
      `${event.id}_${Date.now()}`,
      photo,
    );

    if (!error) {
      // If no errors, update the photo URL
      await updateEvent(event.id, { photo: path });
    } else {
      console.log(error);
    }
  }

  return redirect(`/e/${event.id}`);
};
