import { useNavigate } from '@remix-run/react';
import { Card, CardFooter, CardHeader } from '@nextui-org/react';

import { eventPlaceholderImage } from '~/assets';
import EventCard from '~/components/EventCard';

import type { EventCardInfo } from '~/models/event.server';

/**
 * Three column grid of EventCard components.
 * @param events The list of events to render into cards
 */
export default function EventCards({ events = [] }: { events: EventCardInfo[] }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length ? (
          events.map((event: EventCardInfo) => (
            <div key={event.id} className="flex max-w-[400px] min-w-64">
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <NewEventCard />
        )}
      </div>
    </div>
  );
}

/**
 * Pressable Card component for creating a new Event.
 * Sends user to the create event page on press.
 * @param cardProps (optional) Any additional props are applied to the component's container,
 * reference the NextUI Card docs for available options
 */
export function NewEventCard(cardProps: React.ComponentPropsWithRef<typeof Card>) {
  const navigate = useNavigate();
  const handlePress = () => {
    navigate('/create');
  };

  return (
    <Card
      className="flex-1 w-full bg-transparent p-2 text-foreground"
      isPressable
      key="new"
      onPress={handlePress}
      radius="sm"
      shadow="sm"
      {...cardProps}
    >
      <CardHeader className="absolute z-10 w-80 top-1 flex-col items-start">
        <p className="text-lg text-white/60 font-bold uppercase drop-shadow-sm">
          No Screenings
        </p>
      </CardHeader>
      <img
        alt={`Event poster`}
        className={'object-cover rounded-md size-80'}
        src={eventPlaceholderImage}
      />
      <CardFooter className="absolute z-10 w-80 bottom-1 flex-col items-end">
        <h4 className=" text-3xl font-medium text-white drop-shadow-sm">+ Create Your Own</h4>
      </CardFooter>
    </Card>
  );
}
