import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '@nextui-org/react';

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

  return (
    <>
      <div className='flex gap-2 p-2'>
        <Button radius='full'>New York, NY</Button>
        <Button radius='full'>Date</Button>
        <Button radius='full'>Cost</Button>
      </div>
      <EventCards events={events} />
    </>
  );
}
