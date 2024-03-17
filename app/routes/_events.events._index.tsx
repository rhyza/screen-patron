import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '@nextui-org/react';

import EventCards from '~/components/EventCards';
import { getEventsHosting, getEventsResponded } from '~/models/user.server';
import { invariant } from '~/utils';
export const loader = async () => {
  const userId = 'test';
  invariant(userId, "Missing signed in user's id");
  const hosting = await getEventsHosting(userId);
  const responded = await getEventsResponded(userId);
  return json({ hosting, responded });
};

export default function EventsAttending() {
  const { hosting, responded } = useLoaderData<typeof loader>();

  const [tab, setTab] = useState('upcoming');
  const [events, setEvents] = useState([...hosting.future, ...responded.future]);
  const handlePress = (event: PressEvent) => {
    const { id } = event.target;
    setTab(() => id);
    if (id === 'upcoming') {
      setEvents([...hosting.future, ...responded.future]);
    } else if (id === 'hosting') {
      setEvents(hosting.future);
    } else {
      setEvents([...hosting.past, ...responded.past]);
    }
  };
  const renderTab = (id: string, children: string | JSX.Element) => {
    const active = id === tab ? 'bg-foreground text-background' : '';
    return (
      <Button className={active} onPress={handlePress} id={id} radius="full">
        {children}
      </Button>
    );
  };

  return (
    <>
      <div className="flex gap-2 p-2">
        {renderTab('upcoming', 'Upcoming')}
        {renderTab('hosting', 'Hosting')}
        {renderTab('attended', 'Attended')}
      </div>
      <EventCards events={events} />
    </>
  );
}
