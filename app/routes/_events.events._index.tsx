import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '@nextui-org/react';

import EventCards from '~/components/EventCards';
import { getUserEvents } from '~/services/event';

export const loader = async () => {
  const events = await getUserEvents();
  return json({events});
};

export default function MyEvents() {
  const { events } = useLoaderData<typeof loader>();

  const [tab, setTab] = useState('upcoming');
  const handlePress = (event: PressEvent) => {
    const { id } = event.target;
    setTab(() => id);
  }
  const renderTab = (id: string, children: string | JSX.Element) => {
    const active = id === tab ? 'bg-foreground text-background' : '';
    return (
      <Button className={active} onPress={handlePress} id={id} radius='full'>
        {children}
      </Button>
    );
  }

  return (
    <>
      <div className='flex gap-2 p-2'>
        {renderTab('upcoming', 'Upcoming')}
        {renderTab('hosting', 'Hosting')}
        {renderTab('attended', 'Attended')}
      </div>
      <EventCards events={events} />
    </>
  );
}