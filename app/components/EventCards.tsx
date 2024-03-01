import EventCard from './EventCard';
import type { EventRecord } from '~/services/event';

export default function EventCards({
  events = []
}: {events: EventRecord[]}) {

  return (
    <div>
      {events.length ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {events.map((event: EventRecord) => (
            <div key={event.id} className='flex max-w-[400px] min-w-64'>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) :
        <p><i>No Screenings</i></p>
      }
    </div>
  );
}