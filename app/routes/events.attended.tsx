import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventCards from '~/components/EventCards';
import { getUserEvents } from '~/services/event';

export const loader = async () => {
  const events = await getUserEvents();
  return json({events});
};

export default function MyEvents() {
  const { events } = useLoaderData<typeof loader>();

  return <EventCards events={events} />;
}