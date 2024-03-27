import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventForm from '~/components/EventForm';
import { getSupabaseServerClient, getUserId, uploadImage } from '~/db.server';
import { createEvent, updateEvent } from '~/models/event.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Create a New Event | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const session = await getUserId(supabase);

  return { isSignedIn: session != null };
};

/**
 * `create` — Page for creating a new Event.
 */
export default function CreateEvent() {
  const { isSignedIn } = useLoaderData<typeof loader>();

  return (
    <div className="page-container">
      <EventForm isDisabled={!isSignedIn} />
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = request.formData();

  // Check if user is signed in
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (!userId) {
    throw redirect(`/signin`, 302);
  }

  // eslint-disable-next-line prefer-const, @typescript-eslint/no-unused-vars
  let { photo, prevPhoto, ...updates } = Object.fromEntries(await formData);
  const event = await createEvent(userId, { ...updates });

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
