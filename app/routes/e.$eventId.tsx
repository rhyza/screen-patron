import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventProfile from '~/layouts/EventProfile';

import { getSupabaseServerClient, getUserId } from '~/db.server';
import { getEvent } from '~/models/event.server';
import { getHosts, isHost } from '~/models/host.server';
import { addGuest, countGuests, getGuest, getGuests } from '~/models/rsvp.server';
import { signIn } from '~/models/user.server';
import { invariant } from '~/utils/validate';

export const meta: MetaFunction = () => {
  return [{ title: 'Screen Patron' }, { name: 'description', content: 'DIY Film Events' }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const { supabase } = getSupabaseServerClient(request);
  const [event, userId] = await Promise.all([getEvent(params.eventId), getUserId(supabase)]);

  // Check if event exists
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  const [hosts, guests, isHosting, rsvp] = await Promise.all([
    getHosts(params.eventId),
    getGuests(params.eventId),
    userId ? isHost(params.eventId, userId) : false,
    userId ? getGuest(params.eventId, userId) : null,
  ]);
  const guestCount = countGuests(guests);

  return json({ event, hosts, guests, guestCount, isHosting, rsvp });
};

/**
 * `/e/$eventId` — Page displaying an Event's details and where Users can RSVP.
 */
export default function EventPage() {
  const { event, hosts, guests, guestCount, isHosting, rsvp } =
    useLoaderData<typeof loader>();

  return (
    <div className="page-container">
      <EventProfile
        event={event}
        hosts={hosts}
        guests={guests}
        guestCount={guestCount}
        isHosting={isHosting}
        rsvp={rsvp}
      />
    </div>
  );
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const formData = request.formData();

  // Check if user is signed in
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (!userId) {
    const values = Object.fromEntries(await formData);
    const { error } = await signIn(supabase, values);
    if (error) {
      return json({ success: 0, error });
    }
    return json({ success: Date.now(), error });
  }

  const updates = Object.fromEntries(await formData);
  const { error } = await addGuest({ eventId: params.eventId, userId, ...updates });
  if (error) {
    return json({ success: 0, error });
  }
  return json({ success: Date.now(), error });
};
