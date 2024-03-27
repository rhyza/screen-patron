import { useState } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import ButtonTabs from '~/components/ButtonTabs';
import EventCards from '~/components/EventCards';
import { getSupabaseServerClient, getUserId } from '~/db.server';
import { getEventsHosting, getEventsResponded } from '~/models/user.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'My Events | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const userId = await getUserId(supabase);
  if (!userId) return redirect('/browse');

  const [hosting, responded] = await Promise.all([
    getEventsHosting(userId),
    getEventsResponded(userId),
  ]);
  return json({ hosting, responded });
};

/**
 * `/events` — Page listing events the User is either hosting, is attending, or has attended.
 * Attending status is determined by a "GOING" or "MAYBE" response.
 */
export default function EventsAttending() {
  const { hosting, responded } = useLoaderData<typeof loader>();

  const [events, setEvents] = useState([...hosting.future, ...responded.future]);
  const setContent = (id: string) => {
    if (id === 'upcoming') {
      setEvents([...hosting.future, ...responded.future]);
    } else if (id === 'hosting') {
      setEvents(hosting.future);
    } else {
      setEvents([...hosting.past, ...responded.past]);
    }
  };

  return (
    <>
      <ButtonTabs
        setTabContent={setContent}
        tabs={[
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'hosting', label: 'Hosting' },
          { id: 'attended', label: 'Attended' },
        ]}
      />
      <EventCards events={events} />
    </>
  );
}
