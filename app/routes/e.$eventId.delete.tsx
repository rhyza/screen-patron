import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { eventPlaceholderImage, eventsStoragePath } from '~/assets';
import { deleteImage, getSupabaseServerClient, getUserId } from '~/db.server';
import { deleteEvent, getEvent } from '~/models/event.server';
import { isHost } from '~/models/host.server';
import { invariant } from '~/utils/validate';

/**
 * API endpoint users are directed to after deleting an event.
 * No page is rendered. Users are redirected back to 'My Events' page afterwards.
 */
export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.eventId, 'Missing eventId param');

  // Check if user is signed in
  const { supabase, headers } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (!userId) {
    throw redirect(`/e/${params.eventId}`, 302);
  }

  const [host, event] = await Promise.all([
    isHost(params.eventId, userId),
    getEvent(params.eventId),
  ]);

  // Check if user is a host of this event
  if (!host) {
    throw redirect(`/e/${params.eventId}`, 302);
  }

  // Check if event had a photo
  const photo = event?.photo;
  if (photo && photo.startsWith(eventsStoragePath) && photo != eventPlaceholderImage) {
    // And delete both the photo and the event if one exists
    const path = photo.slice(eventsStoragePath.length);
    Promise.all([deleteImage(supabase, 'events', path), deleteEvent(params.eventId)])
      .then(() => {
        return redirect('/events', { headers });
      })
      .catch((error) => console.log(error));
  } else {
    // Or just delete the event
    deleteEvent(params.eventId)
      .then(() => {
        return redirect('/events', { headers });
      })
      .catch((error) => console.log(error));
  }

  return redirect('/events', { headers });
}
