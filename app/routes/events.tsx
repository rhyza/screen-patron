import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '@nextui-org/react';

import EventCards from '~/components/EventCards';
import { getEvents } from '~/services/event';

export const meta: MetaFunction = () => {
  return [
    {title: 'New Remix App'},
    {name: 'description', content: 'Welcome to Remix!'},
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const events = await getEvents(q);
  return json({events, q});
};

export default function Events() {
  const { events, q } = useLoaderData<typeof loader>();

  const [section, setSection] = useState('browse');
  const handlePress = (event: PressEvent) => {
    const { id } = event.target;
    setSection(() => id);
  };

  const sectionButton = (id: string, label: string) => {
    return (
      <Button
        className={section === id ? 'bg-gradiant' : ''}
        id={id}
        onPress={handlePress}
        radius='full'
      >
        {label}
      </Button>
    );
  };

  return (
    <div className='w-full p-6 flex justify-center'>
      <div className='max-w-[70rem]'>
        <div className='grid px-2 pb-6'>
          <div className='flex gap-2'>
            {sectionButton('browse', 'What\'s On')}
            {sectionButton('upcoming', 'Upcoming')}
            {sectionButton('hosting', 'Hosting')}
            {sectionButton('attended', 'Attended')}
          </div>
        </div>
        <EventCards events={events} />
      </div>
    </div>
  );
}