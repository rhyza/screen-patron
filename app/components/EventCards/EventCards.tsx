import EventCard from './EventCard';
import { NewEventCard } from './NewEventCard';

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
