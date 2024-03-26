import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventProfile from '~/components/EventProfile';
import { getSession, getSupabaseServerClient } from '~/db.server';
import { getEvent } from '~/models/event.server';
import { getHosts, isHost } from '~/models/host.server';
import { countGuests, getGuest, getGuests } from '~/models/rsvp.server';
import { invariant } from '~/utils';

export const meta: MetaFunction = () => {
  return [{ title: 'Screen Patron' }, { name: 'description', content: 'DIY Film Events' }];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.eventId, 'Missing eventId param');
  const { supabase } = getSupabaseServerClient(request);
  const [event, session] = await Promise.all([
    getEvent(params.eventId),
    getSession(supabase),
  ]);

  // Check if event exists
  if (!event) {
    throw new Response('Not Found', { status: 404 });
  }

  const [hosts, guests, isUser, rsvp] = await Promise.all([
    getHosts(params.eventId),
    getGuests(params.eventId),
    session?.user?.id ? isHost(params.eventId, session.user.id) : false,
    session?.user?.id ? getGuest(params.eventId, session.user.id) : null,
  ]);
  const guestCount = countGuests(guests);

  return json({ event, hosts, guests, guestCount, isUser, rsvp });
};

/**
 * `/e/$eventId` — Page displaying an Event's details and where Users can RSVP.
 */
export default function EventPage() {
  const { event, hosts, guests, guestCount, isUser, rsvp } = useLoaderData<typeof loader>();

  return (
    <div className="w-full p-6">
      <EventProfile
        event={event}
        hosts={hosts}
        guests={guests}
        guestCount={guestCount}
        isUser={isUser}
        rsvp={rsvp}
      />
    </div>
  );
}
