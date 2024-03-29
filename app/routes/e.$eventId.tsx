import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';

import EventProfile from '~/components/EventProfile';
import { getSupabaseServerClient, getUserId } from '~/db.server';
import { getEvent } from '~/models/event.server';
import { getHosts, isHost } from '~/models/host.server';
import { addGuest, countGuests, getGuest, getGuests } from '~/models/rsvp.server';
import { signIn } from '~/models/user.server';
import { invariant } from '~/utils';

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

  return json({ event, hosts, guests, guestCount, isHosting, rsvp, userId });
};

/**
 * `/e/$eventId` — Page displaying an Event's details and where Users can RSVP.
 */
export default function EventPage() {
  const { event, hosts, guests, guestCount, isHosting, rsvp, userId } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const hasSent = actionData?.success || false;
  const getModalContent = () => {
    if (!userId && !hasSent) {
      return 'signIn';
    } else if (!userId && hasSent) {
      return 'signInConfirmed'; // has email sent?
    } else if (hasSent) {
      return 'rsvpConfirmed'; // has rsvp sent?
    } else {
      return 'rsvpForm';
    }
  };

  return (
    <div className="page-container">
      <EventProfile
        event={event}
        hosts={hosts}
        guests={guests}
        guestCount={guestCount}
        isHosting={isHosting}
        modalContent={getModalContent()}
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
      return json({ success: false, error });
    }
    return json({ success: true, error });
  }

  const updates = Object.fromEntries(await formData);
  const { error } = await addGuest({ eventId: params.eventId, userId, ...updates });
  if (error) {
    return json({ success: false, error });
  }
  return json({ success: true, error });
};
