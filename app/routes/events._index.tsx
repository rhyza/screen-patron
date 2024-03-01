import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import EventCards from '~/components/EventCards';
import { getEvents } from '~/services/event';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const events = await getEvents(q);
  return json({events, q});
};

export default function BrowseEvents() {
  const { events, q } = useLoaderData<typeof loader>();

  return <EventCards events={events} />;
}