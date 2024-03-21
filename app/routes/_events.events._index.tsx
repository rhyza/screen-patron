import { useState } from 'react';
import { PressEvent } from '@react-types/shared';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '@nextui-org/react';

import EventCards from '~/components/EventCards';
import { getSupabaseServerClient } from '~/db.server';
import { getEventsHosting, getEventsResponded } from '~/models/user.server';
import { invariant } from '~/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'My Events | Screen Patron' },
    { name: 'description', content: 'DIY Film Events' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = getSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect('/browse');
  invariant(user.id, "Missing signed in user's id");

  const hosting = await getEventsHosting(user.id);
  const responded = await getEventsResponded(user.id);
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

  return (
    <>
      <div className="flex gap-2 p-2">
        <EventTab id="upcoming" activeTab={tab} handlePress={handlePress}>
          Upcoming
        </EventTab>
        <EventTab id="hosting" activeTab={tab} handlePress={handlePress}>
          Hosting
        </EventTab>
        <EventTab id="attended" activeTab={tab} handlePress={handlePress}>
          Attended
        </EventTab>
      </div>
      <EventCards events={events} />
    </>
  );
}

function EventTab({
  id,
  activeTab,
  handlePress,
  children,
}: {
  id: string;
  activeTab: string;
  handlePress: (e: PressEvent) => void;
  children: string | JSX.Element;
}) {
  const active = id === activeTab ? 'bg-foreground text-background' : '';
  return (
    <Button className={active} onPress={handlePress} id={id} radius="full">
      {children}
    </Button>
  );
}
