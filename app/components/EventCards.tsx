import EventCard from './EventCard';
import type { EventInfo } from '~/models/event.server';

/**
 * Three column grid of EventCard components.
 * @param events The list of events to render into cards
 */
export default function EventCards({ events = [] }: { events: EventInfo[] }) {
  return (
    <div>
      {events.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: EventInfo) => (
            <div key={event.id} className="flex max-w-[400px] min-w-64">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <p>
          <i>No Screenings</i>
        </p>
      )}
    </div>
  );
}
